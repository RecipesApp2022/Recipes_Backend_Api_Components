import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailContactsController } from './email-contacts.controller';
import { EmailContactsService } from './email-contacts.service';
import { EmailContact } from './entities/email-contact.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmailContact])],
  controllers: [EmailContactsController],
  providers: [EmailContactsService],
})
export class EmailContactsModule {}
