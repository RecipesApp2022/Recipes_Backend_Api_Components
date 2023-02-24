import { Module } from '@nestjs/common';
import { ComboPurposesService } from './combo-purposes.service';
import { ComboPurposesController } from './combo-purposes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComboPurpose } from './entities/combo-purpose.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ComboPurpose,
    ]),
  ],
  providers: [ComboPurposesService],
  controllers: [ComboPurposesController]
})
export class ComboPurposesModule {}
