import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Combo } from 'src/combos/entities/combo.entity';
import { Plan } from 'src/plans/entities/plan.entity';
import { Recipe } from 'src/recipes/entities/recipes.entity';
import { Favorite } from './entities/favorite.entity';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Favorite,
      Recipe,
      Plan,
      Combo,
    ]),
  ],
  controllers: [FavoritesController],
  providers: [FavoritesService]
})
export class FavoritesModule {}
