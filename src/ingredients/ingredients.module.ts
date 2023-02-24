import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import { filenameGenerator } from 'src/support/file-uploads';
import { Ingredient } from './entities/ingredient.entity';
import { IngredientsController } from './ingredients.controller';
import { IngredientsService } from './ingredients.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ingredient]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/ingredients',
        filename: filenameGenerator,
      })
    }),
  ],
  controllers: [IngredientsController],
  providers: [IngredientsService]
})
export class IngredientsModule {}
