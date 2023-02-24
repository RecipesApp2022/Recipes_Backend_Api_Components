import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientType } from './entities/ingredient-type.entity';
import { IngredientTypesController } from './ingredient-types.controller';
import { IngredientTypesService } from './ingredient-types.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([IngredientType]),
  ],
  controllers: [IngredientTypesController],
  providers: [IngredientTypesService]
})
export class IngredientTypesModule {}
