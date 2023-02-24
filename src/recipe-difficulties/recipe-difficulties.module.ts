import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeDifficulty } from './entities/recipe-difficulty.entity';
import { RecipeDifficultiesController } from './recipe-difficulties.controller';
import { RecipeDifficultiesService } from './recipe-difficulties.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecipeDifficulty]),
  ],
  controllers: [RecipeDifficultiesController],
  providers: [RecipeDifficultiesService]
})
export class RecipeDifficultiesModule {}
