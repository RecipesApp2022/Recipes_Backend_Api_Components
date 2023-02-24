import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportModule } from 'src/support/support.module';
import { User } from 'src/users/entities/user.entity';
import { AdminsController } from './admins.controller';
import { AdminsService } from './admins.service';
import { diskStorage } from 'multer';
import { filenameGenerator } from 'src/support/file-uploads';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/admins',
        filename: filenameGenerator,
      })
    }),
    SupportModule,
  ],
  controllers: [AdminsController],
  providers: [AdminsService]
})
export class AdminsModule {}
