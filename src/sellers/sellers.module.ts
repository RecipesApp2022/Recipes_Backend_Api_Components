import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { SellersController } from './sellers.controller';
import { SellersService } from './sellers.service';
import { diskStorage } from 'multer';
import { filenameGenerator } from 'src/support/file-uploads';
import { SupportModule } from 'src/support/support.module';
import { Occupation } from 'src/occupations/entities/occupation.entity';
import { SellerRating } from 'src/seller-ratings/entities/seller-rating.entity';
import { SellerRatedListener } from './listeners/seller-rated.listener';
import { Seller } from './entities/seller.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Occupation,
      Seller,
      SellerRating,
    ]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/sellers',
        filename: filenameGenerator,
      })
    }),
    SupportModule,
  ],
  controllers: [SellersController],
  providers: [SellersService, SellerRatedListener],
})
export class SellersModule {}
