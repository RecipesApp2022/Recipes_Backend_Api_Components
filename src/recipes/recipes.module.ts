import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import { Category } from 'src/categories/entities/category.entity';
import { MealPeriod } from 'src/meal-periods/entities/meal-period.entity';
import { Rating } from 'src/ratings/entities/rating.entity';
import { Seller } from 'src/sellers/entities/seller.entity';
import { filenameGenerator } from 'src/support/file-uploads';
import { SupportModule } from 'src/support/support.module';
import { RecipeImage } from './entities/recipe-image.entity';
import { RecipeIngredient } from './entities/recipe-ingredient.entity';
import { RecipeStep } from './entities/recipe-step.entity';
import { RecipeVideo } from './entities/recipe-video.entity';
import { Recipe } from './entities/recipes.entity';
import { ItemRatedListener } from './listeners/item-rated.listener';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Recipe,
      Category,
      MealPeriod,
      Seller,
      RecipeIngredient,
      RecipeVideo,
      RecipeStep,
      RecipeImage,
      Rating,
    ]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/recipes',
        filename: filenameGenerator,
      })
    }),
    SupportModule,
  ],
  controllers: [RecipesController],
  providers: [RecipesService, ItemRatedListener]
})
export class RecipesModule {}
