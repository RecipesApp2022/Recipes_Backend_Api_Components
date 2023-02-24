import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ArrayOfFilesToBodyInterceptor } from 'src/support/interceptors/array-of-files-to-body.interceptor';
import { JwtUserToBodyInterceptor } from 'src/support/interceptors/jwt-user-to-body.interceptor';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { SellerIdToBodyInterceptor } from 'src/support/interceptors/seller-id-to-body.interceptor';
import { UserRoleToBodyInterceptor } from 'src/support/interceptors/user-role-to-body.interceptor';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Role } from 'src/users/enums/role.enum';
import { ChatsService } from './chats.service';
import { FindOneChatDto } from './dto/find-one-chat.dto';
import { PaginateChatsDto } from './dto/paginate-chats.dto';
import { ReadChatDto } from './dto/read-chat.dto';
import { ReadMessageDto } from './dto/read-message.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { SendMessageToSellerDto } from './dto/sent-message-to-seller.dto';
import { ChatPaginationPipe } from './pipes/chat-pagination.pipe';
import { MessagePaginationPipe } from './pipes/message-pagination.pipe';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get()
  @Roles(Role.CLIENT, Role.SELLER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(
    new UserRoleToBodyInterceptor(),
    new JwtUserToBodyInterceptor('clientId'),
    SellerIdToBodyInterceptor,
  )
  async paginate(
    @Query(ChatPaginationPipe) options: any,
    @Body() paginateChatsDto: PaginateChatsDto,
  ): Promise<PaginationResult<ReadChatDto>> {
    return (
      await this.chatsService.paginate(options, paginateChatsDto)
    ).toClass(ReadChatDto);
  }

  @Get(':id')
  @Roles(Role.CLIENT, Role.SELLER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(
    new UserRoleToBodyInterceptor(),
    new JwtUserToBodyInterceptor('clientId'),
    SellerIdToBodyInterceptor,
    new ParamsToBodyInterceptor({ id: 'id' }),
  )
  async findOne(@Body() findOneChatDto: FindOneChatDto): Promise<ReadChatDto> {
    return plainToClass(
      ReadChatDto,
      await this.chatsService.findOne(findOneChatDto),
    );
  }

  @Post()
  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(
    FilesInterceptor('attachments'),
    new ArrayOfFilesToBodyInterceptor('attachments'),
    new JwtUserToBodyInterceptor('clientId'),
  )
  async sendMessageToSeller(
    @Body() sendMessageToSellerDto: SendMessageToSellerDto,
  ): Promise<ReadChatDto> {
    return plainToClass(
      ReadChatDto,
      await this.chatsService.sendMessageToSeller(sendMessageToSellerDto),
    );
  }

  @Post(':id/messages')
  @Roles(Role.CLIENT, Role.SELLER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(
    FilesInterceptor('attachments'),
    new ArrayOfFilesToBodyInterceptor('attachments'),
    new UserRoleToBodyInterceptor(),
    new JwtUserToBodyInterceptor(),
    SellerIdToBodyInterceptor,
    new ParamsToBodyInterceptor({ id: 'chatId' }),
  )
  async sendMessage(
    @Body() sendMessageDto: SendMessageDto,
  ): Promise<ReadMessageDto> {
    return plainToClass(
      ReadMessageDto,
      await this.chatsService.sendMessage(sendMessageDto),
    );
  }

  @Get(':id/messages')
  @UseInterceptors(new ParamsToBodyInterceptor({ id: 'id' }))
  async paginateMessages(
    @Query(MessagePaginationPipe) options: any,
    @Body('id') id: string,
  ): Promise<PaginationResult<ReadMessageDto>> {
    return (await this.chatsService.paginateMessages(options, +id)).toClass(
      ReadMessageDto,
    );
  }
}
