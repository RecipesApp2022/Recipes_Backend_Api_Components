import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealPeriod } from './entities/meal-period.entity';
import { MealPeriodsController } from './meal-periods.controller';
import { MealPeriodsService } from './meal-periods.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MealPeriod]),
  ],
  controllers: [MealPeriodsController],
  providers: [MealPeriodsService]
})
export class MealPeriodsModule {}
