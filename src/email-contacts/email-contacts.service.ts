import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailContactEvent } from 'src/notifications/events/email-contact-event.enum';
import { Repository } from 'typeorm';
import { CreateEmailContactDto } from './dto/create-email-contact.dto';
import { EmailContactCreatedEvent } from './dto/email-contact-created.event';
import { EmailContact } from './entities/email-contact.entity';

@Injectable()
export class EmailContactsService {
  constructor(
    @InjectRepository(EmailContact)
    private readonly emailContactsRepository: Repository<EmailContact>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(
    createEmailContactDto: CreateEmailContactDto,
  ): Promise<EmailContact> {
    const emailContact = EmailContact.create(createEmailContactDto);

    const savedEmailContact = await this.emailContactsRepository.save(
      emailContact,
    );

    this.eventEmitter.emit(
      EmailContactEvent.CREATED,
      new EmailContactCreatedEvent(
        createEmailContactDto.email,
        createEmailContactDto.content,
      ),
    );

    return savedEmailContact;
  }
}
