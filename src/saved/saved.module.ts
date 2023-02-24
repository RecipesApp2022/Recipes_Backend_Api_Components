import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Saved } from './entities/saved.entity';
import { SavedController } from './saved.controller';
import { SavedService } from './saved.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Saved,
    ]),
  ],
  controllers: [SavedController],
  providers: [SavedService]
})
export class SavedModule {}
