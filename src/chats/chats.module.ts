import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import { Seller } from 'src/sellers/entities/seller.entity';
import { filenameGenerator } from 'src/support/file-uploads';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { Chat } from './entities/chat.entity';
import { Message } from './entities/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Seller, Chat, Message]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/message-attachments',
        filename: filenameGenerator,
      }),
    }),
  ],
  controllers: [ChatsController],
  providers: [ChatsService],
})
export class ChatsModule {}
