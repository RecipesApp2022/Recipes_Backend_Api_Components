import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailContactCreatedEvent } from 'src/email-contacts/dto/email-contact-created.event';
import { MailService } from 'src/mail/mail.service';
import { EmailContactEvent } from '../events/email-contact-event.enum';

@Injectable()
export class EmailContactCreatedListener {
  constructor(private readonly mailService: MailService) {}

  @OnEvent(EmailContactEvent.CREATED)
  async handleEmailContactCreatedEvent(
    emailContactCreatedEvent: EmailContactCreatedEvent,
  ): Promise<void> {
    await this.mailService.sendContactEmail(emailContactCreatedEvent);
  }
}
