import { Body, Controller, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtUserToBodyInterceptor } from 'src/support/interceptors/jwt-user-to-body.interceptor';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Role } from 'src/users/enums/role.enum';
import { CommentsService } from './comments.service';
import { AnswerCommentDto } from './dto/answer-comment.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ReadCommentDto } from './dto/read-comment.dto';
import { CommentPaginationPipe } from './pipes/comment-pagination.pipe';

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @Get()
    async paginate(@Query(CommentPaginationPipe) options: any): Promise<PaginationResult<ReadCommentDto>> {
        return (await this.commentsService.paginate(options)).toClass(ReadCommentDto);
    }
    
    @Post()
    @Roles(Role.CLIENT)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(new JwtUserToBodyInterceptor('clientId'))
    async create(@Body() createCommentDto: CreateCommentDto): Promise<ReadCommentDto> {
        return plainToClass(ReadCommentDto, await this.commentsService.create(createCommentDto));
    }

    @Put(':id/answer')
    @Roles(Role.SELLER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(new ParamsToBodyInterceptor({ id: 'id' }))
    async answer(@Body() answerCommentDto: AnswerCommentDto): Promise<ReadCommentDto> {
        return plainToClass(ReadCommentDto, await this.commentsService.answer(answerCommentDto));
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<ReadCommentDto> {
        return plainToClass(ReadCommentDto, await this.commentsService.findOne(+id));
    }
}
