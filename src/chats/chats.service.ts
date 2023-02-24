import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { applySort } from 'src/database/utils/sort';
import { FileRenamer } from 'src/support/file-renamer';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Role } from 'src/users/enums/role.enum';
import { Repository } from 'typeorm';
import { ChatPaginationOptionsDto } from './dto/chat-pagination-options.dto';
import { FindOneChatDto } from './dto/find-one-chat.dto';
import { MessagePaginationOptionsDto } from './dto/message-pagination-options.dto';
import { PaginateChatsDto } from './dto/paginate-chats.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { SendMessageToSellerDto } from './dto/sent-message-to-seller.dto';
import { Chat } from './entities/chat.entity';
import { MessageAttachment } from './entities/message-attachment.entity';
import { Message } from './entities/message.entity';
import { ChatNotFoundException } from './errors/chat-not-found.exception';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat) private readonly chatsRepository: Repository<Chat>,
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
  ) {}

  async paginate(
    { perPage, offset, filters: { id }, sort }: ChatPaginationOptionsDto,
    { role, sellerId, clientId }: PaginateChatsDto,
  ): Promise<PaginationResult<Chat>> {
    const queryBuilder = this.chatsRepository
      .createQueryBuilder('chat')
      .innerJoinAndSelect('chat.client', 'client')
      .innerJoinAndSelect('chat.seller', 'seller')
      .take(perPage)
      .skip(offset);

    if (role === Role.CLIENT) {
      queryBuilder.andWhere('chat.clientId = :clientId', { clientId });
    } else if (role === Role.SELLER) {
      queryBuilder.andWhere('chat.sellerId = :sellerId', { sellerId });
    }

    if (id) queryBuilder.andWhere('chat.id = :id', { id });

    applySort({ sort, entityAlias: 'chat', queryBuilder });

    const [chats, total] = await queryBuilder.getManyAndCount();

    const chatsWithMessages = await Promise.all(
      chats.map(async (chat) =>
        Chat.create({
          ...chat,
          messages: await this.messagesRepository
            .createQueryBuilder('message')
            .leftJoinAndSelect('message.attachments', 'attachment')
            .take(10)
            .where('message.chatId = :chatId', { chatId: chat.id })
            .orderBy('message.createdAt', 'DESC')
            .getMany(),
        }),
      ),
    );

    return new PaginationResult(chatsWithMessages, total, perPage);
  }

  async findOne({
    id,
    role,
    sellerId,
    clientId,
  }: FindOneChatDto): Promise<Chat> {
    const queryBuilder = this.chatsRepository
      .createQueryBuilder('chat')
      .innerJoinAndSelect('chat.client', 'client')
      .innerJoinAndSelect('chat.seller', 'seller')
      .where('chat.id = :id', { id });

    if (role === Role.CLIENT) {
      queryBuilder.andWhere('chat.clientId = :clientId', { clientId });
    } else if (role === Role.SELLER) {
      queryBuilder.andWhere('chat.sellerId = :sellerId', { sellerId });
    }

    const chat = await queryBuilder.getOne();

    chat.messages = await this.messagesRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.attachments', 'attachment')
      .take(10)
      .where('message.chatId = :chatId', { chatId: chat.id })
      .orderBy('message.createdAt', 'DESC')
      .getMany();

    if (!chat) {
      throw new ChatNotFoundException();
    }

    return chat;
  }

  async sendMessageToSeller({
    clientId,
    sellerId,
    content,
    attachments,
  }: SendMessageToSellerDto): Promise<Chat> {
    const messageAttachments = attachments.map((attachment) =>
      MessageAttachment.create({
        name: attachment.originalname,
        path: attachment.path,
      }),
    );

    let chat = await this.chatsRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.messages', 'message')
      .leftJoinAndSelect('message.attachments', 'attachment')
      /**
       * Don't load all messages, it will use too much memory
       */
      .where('chat.clientId = :clientId', { clientId })
      .andWhere('chat.sellerId = :sellerId', { sellerId })
      .getOne();

    const message = Message.create({
      content,
      userId: clientId,
      attachments: messageAttachments,
    });

    if (chat) {
      chat.messages.push(message);
    } else {
      chat = Chat.create({
        clientId,
        sellerId,
        messages: [message],
      });
    }

    return await this.chatsRepository.save(chat);
  }

  async sendMessage({
    role,
    userId,
    sellerId,
    chatId,
    content,
    attachments,
  }: SendMessageDto): Promise<Message> {
    const queryBuilder = this.chatsRepository
      .createQueryBuilder('chat')
      .where('chat.id = :chatId', { chatId });

    const clientId = userId;

    if (role === Role.CLIENT) {
      queryBuilder.andWhere('chat.clientId = :clientId', { clientId });
    } else if (role === Role.SELLER) {
      queryBuilder.andWhere('chat.sellerId = :sellerId', { sellerId });
    }

    const chat = await queryBuilder.getOne();

    if (!chat) {
      throw new ChatNotFoundException();
    }

    const messageAttachments = attachments.map((attachment) =>
      MessageAttachment.create({
        name: attachment.originalname,
        path: attachment.path,
      }),
    );

    const message = Message.create({
      content,
      userId,
      chatId: chat.id,
      attachments: messageAttachments,
    });

    return await this.messagesRepository.save(message);
  }

  async paginateMessages(
    {
      perPage,
      offset,
      filters: { id, idAfter },
      sort,
    }: MessagePaginationOptionsDto,
    chatId: number,
  ): Promise<PaginationResult<Message>> {
    const queryBuilder = this.messagesRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.attachments', 'attachment')
      .where('message.chatId = :chatId', { chatId })
      .take(perPage)
      .skip(offset);

    if (id) queryBuilder.andWhere('message.id = :id', { id });

    if (idAfter) queryBuilder.andWhere('message.id > :idAfter', { idAfter });

    applySort({ sort, entityAlias: 'message', queryBuilder });

    const [messages, total] = await queryBuilder.getManyAndCount();

    return new PaginationResult(messages, total, perPage);
  }
}
