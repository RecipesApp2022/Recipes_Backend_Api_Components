import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportModule } from 'src/support/support.module';
import { User } from 'src/users/entities/user.entity';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { diskStorage } from 'multer';
import { filenameGenerator } from 'src/support/file-uploads';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    SupportModule,
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/clients',
        filename: filenameGenerator,
      })
    }),
  ],
  controllers: [ClientsController],
  providers: [ClientsService]
})
export class ClientsModule {}
