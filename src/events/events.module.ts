import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Plan } from 'src/plans/entities/plan.entity';
import { Recipe } from 'src/recipes/entities/recipes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Event,
      Recipe,
      Plan,
      Recipe,
    ]),
  ],
  providers: [EventsService],
  controllers: [EventsController],
  exports: [EventsService]
})
export class EventsModule {}
