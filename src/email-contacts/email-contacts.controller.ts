import { Body, Controller, Post } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateEmailContactDto } from './dto/create-email-contact.dto';
import { ReadEmailContactDto } from './dto/read-email-contact.dto';
import { EmailContactsService } from './email-contacts.service';

@Controller('email-contacts')
export class EmailContactsController {
  constructor(private readonly emailContactsService: EmailContactsService) {}

  @Post()
  async create(
    @Body() createEmailContactDto: CreateEmailContactDto,
  ): Promise<ReadEmailContactDto> {
    return plainToClass(
      ReadEmailContactDto,
      await this.emailContactsService.create(createEmailContactDto),
    );
  }
}
