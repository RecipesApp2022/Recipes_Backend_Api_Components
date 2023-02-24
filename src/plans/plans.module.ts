import { Module, OnModuleInit } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import { Category } from 'src/categories/entities/category.entity';
import { MealPeriod } from 'src/meal-periods/entities/meal-period.entity';
import { Rating } from 'src/ratings/entities/rating.entity';
import { Seller } from 'src/sellers/entities/seller.entity';
import { filenameGenerator } from 'src/support/file-uploads';
import { SupportModule } from 'src/support/support.module';
import { Repository } from 'typeorm';
import { PlanDay } from './entities/plan-day.entity';
import { PlanImage } from './entities/plan-image.entity';
import { Plan } from './entities/plan.entity';
import { ItemRatedListener } from './listeners/item-rated.listener';
import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Plan,
      PlanDay,
      PlanImage,
      Category,
      Seller,
      MealPeriod,
      Rating,
    ]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/plans',
        filename: filenameGenerator,
      })
    }),
    SupportModule,
  ],
  controllers: [PlansController],
  providers: [PlansService, ItemRatedListener]
})
export class PlansModule implements OnModuleInit {
  constructor(@InjectRepository(MealPeriod) private readonly mealPeriodsRepository: Repository<MealPeriod>) {}
  
  async onModuleInit() {
    PlanDay.mealPeriods = await this.mealPeriodsRepository.find();
  }
}
