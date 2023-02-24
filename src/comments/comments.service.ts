import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';
import { Client } from 'src/clients/entities/client.entity';
import { EntityIdIsRequiredException } from './errors/entity-id-is-required.exception';
import { OnlyOneEntityAllowedException } from './errors/only-one-entity-allowed.exception';
import { AnswerCommentDto } from './dto/answer-comment.dto';
import { CommentNotFoundException } from './errors/comment-not-found.exception';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { CommentPaginationOptionsDto } from './dto/comment-pagination-options.dto';
import { applySort } from 'src/database/utils/sort';
import { ClientNotFoundException } from 'src/clients/errors/client-not-found.exception';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CommentEvent } from 'src/notifications/events/comment-event.enum';
import { CommentCreatedEvent } from 'src/notifications/dto/comment-created.event';
import { CommentAnsweredEvent } from 'src/notifications/dto/comment-answered.event';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment) private readonly commentsRepository: Repository<Comment>,
        @InjectRepository(Client) private readonly clientsRepository: Repository<Client>,
        private readonly eventEmitter: EventEmitter2
    ) {}

    async paginate({ perPage, offset, filters: {
        id,
        name,
        sellerId,
        clientId,
        comment,
        recipeId,
        planId,
        comboId,
    }, sort }: CommentPaginationOptionsDto): Promise<PaginationResult<Comment>> {
        const queryBuilder = this.commentsRepository.createQueryBuilder('comment')
            .leftJoinAndSelect('comment.client', 'client')
            .leftJoinAndSelect('comment.recipe', 'recipe')
            .leftJoinAndSelect('recipe.seller', 'recipeSeller')
            .leftJoinAndSelect('comment.plan', 'plan')
            .leftJoinAndSelect('plan.seller', 'planSeller')
            .leftJoinAndSelect('comment.combo', 'combo')
            .leftJoinAndSelect('combo.seller', 'comboSeller')
            .take(perPage)
            .skip(offset);

        if (id) queryBuilder.andWhere('comment.id = :id', { id });

        if (name) queryBuilder.andWhere('client.name LIKE :name', { name: `%${name}%` });

        if (sellerId) queryBuilder.andWhere('recipe.sellerId = :sellerId OR plan.sellerId = :sellerId OR combo.sellerId = :sellerId', { sellerId });

        if (clientId) queryBuilder.andWhere('comment.clientId = :clientId', { clientId });

        if (comment) queryBuilder.andWhere('comment.comment LIKE :comment', { comment: `%${comment}%` });

        if (recipeId) queryBuilder.andWhere('recipe.id = :recipeId', { recipeId });

        if (planId) queryBuilder.andWhere('plan.id = :planId', { planId });

        if (comboId) queryBuilder.andWhere('combo.id = :comboId', { comboId });

        applySort({
            queryBuilder,
            sort,
            entityAlias: 'comment',
        });

        const [comments, total] = await queryBuilder.getManyAndCount();
        
        return new PaginationResult(comments, total, perPage);
    }

    async create({ clientId, type, ...createCommentDto }: CreateCommentDto): Promise<Comment> {
        const noOwnerEntityIdProvided = !createCommentDto.recipeId && !createCommentDto.planId && !createCommentDto.comboId;
        
        if (noOwnerEntityIdProvided) {
            throw new EntityIdIsRequiredException();
        }

        const moreThanOneEntitySelected = (createCommentDto.recipeId && createCommentDto.planId) ||
            (createCommentDto.recipeId && createCommentDto.comboId) ||
            (createCommentDto.planId && createCommentDto.comboId);
        
        if (moreThanOneEntitySelected) {
            throw new OnlyOneEntityAllowedException();
        }
            
        const client = await this.clientsRepository.findOne(clientId);

        if (!client) {
            throw new ClientNotFoundException();
        }
        
        const comment = Comment.create({
            ...createCommentDto,
            client,
        });
        
        const savedComment = await this.commentsRepository.save(comment);

        this.eventEmitter.emit(CommentEvent.COMMENT_CREATED, new CommentCreatedEvent({
            commentId: comment.id,
            type,
            productId: createCommentDto.recipeId | createCommentDto.planId | createCommentDto.comboId,
        }));
        
        return savedComment;
    }

    async answer({ id, ...answerCommentDto}: AnswerCommentDto): Promise<Comment> {
        const comment = await this.commentsRepository.createQueryBuilder('comment')
            .where('comment.id = :id', { id })
            .andWhere('comment.answer IS NULL')
            /**
             * Validate seller owns the comment
             */
            .getOne();

        if (!comment) {
            throw new CommentNotFoundException();
        }

        Object.assign(comment, {
            ...answerCommentDto,
            answeredAt: new Date(),
        });

        const savedComment = await this.commentsRepository.save(comment);

        this.eventEmitter.emit(CommentEvent.COMMENT_ANSWERED, new CommentAnsweredEvent({
            commentId: comment.id,
            type: comment.type,
            clientId: comment.clientId,
            productId: comment.productId,
        }));
        
        return savedComment;
    }

    async findOne(id: number): Promise<Comment> {
        const comment = await this.commentsRepository.createQueryBuilder('comment')
            .leftJoinAndSelect('comment.client', 'client')
            .leftJoinAndSelect('comment.recipe', 'recipe')
            .leftJoinAndSelect('recipe.seller', 'recipeSeller')
            .leftJoinAndSelect('comment.plan', 'plan')
            .leftJoinAndSelect('plan.seller', 'planSeller')
            .leftJoinAndSelect('comment.combo', 'combo')
            .leftJoinAndSelect('combo.seller', 'comboSeller')
            .where('comment.id = :id', { id })
            .getOne();

        if (!comment) {
            throw new CommentNotFoundException();
        }

        return comment;
    }
}
