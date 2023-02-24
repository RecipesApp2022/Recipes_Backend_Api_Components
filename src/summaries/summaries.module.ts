import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'src/clients/entities/client.entity';
import { Combo } from 'src/combos/entities/combo.entity';
import { Plan } from 'src/plans/entities/plan.entity';
import { Recipe } from 'src/recipes/entities/recipes.entity';
import { SellerRating } from 'src/seller-ratings/entities/seller-rating.entity';
import { Seller } from 'src/sellers/entities/seller.entity';
import { SummariesController } from './summaries.controller';
import { SummariesService } from './summaries.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Seller,
      Client,
      Recipe,
      Plan,
      Combo,
      SellerRating,
    ])
  ],
  controllers: [SummariesController],
  providers: [SummariesService]
})
export class SummariesModule {}
