import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import { filenameGenerator } from 'src/support/file-uploads';
import { AdsController } from './ads.controller';
import { AdsService } from './ads.service';
import { Ad } from './entities/ad.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Ad,
    ]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/ads',
        filename: filenameGenerator,
      })
    }),
  ],
  controllers: [AdsController],
  providers: [AdsService]
})
export class AdsModule {}
