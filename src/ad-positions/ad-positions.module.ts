import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdPositionsController } from './ad-positions.controller';
import { AdPositionsService } from './ad-positions.service';
import { AdPosition } from './entities/ad-position.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AdPosition,
    ]),
  ],
  controllers: [AdPositionsController],
  providers: [AdPositionsService]
})
export class AdPositionsModule {}
