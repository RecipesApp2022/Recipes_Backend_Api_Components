import { Module } from '@nestjs/common';
import { CombosService } from './combos.service';
import { CombosController } from './combos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Combo } from './entities/combo.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { filenameGenerator } from 'src/support/file-uploads';
import { Category } from 'src/categories/entities/category.entity';
import { Seller } from 'src/sellers/entities/seller.entity';
import { Recipe } from 'src/recipes/entities/recipes.entity';
import { Plan } from 'src/plans/entities/plan.entity';
import { ComboImage } from './entities/combo-image.entity';
import { SupportModule } from 'src/support/support.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Seller,
      Combo,
      ComboImage,
      Category,
      Recipe,
      Plan,
    ]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/combos',
        filename: filenameGenerator,
      })
    }),
    SupportModule,
  ],
  providers: [CombosService],
  controllers: [CombosController]
})
export class CombosModule {}
