import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Occupation } from './entities/occupation.entity';
import { OccupationsController } from './occupations.controller';
import { OccupationsService } from './occupations.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Occupation]),
  ],
  controllers: [OccupationsController],
  providers: [OccupationsService]
})
export class OccupationsModule {}
