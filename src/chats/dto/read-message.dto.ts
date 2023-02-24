import { Exclude, Expose, Type } from 'class-transformer';
import { ReadMessageAttachmentDto } from './read-message-attachment.dto';

@Exclude()
export class ReadMessageDto {
  @Expose()
  public readonly id: number;

  @Expose()
  public readonly content: string;

  @Expose()
  public readonly isRead: boolean;

  @Expose()
  public readonly userId: number;

  @Expose()
  public readonly createdAt: string;

  @Expose()
  @Type(() => ReadMessageAttachmentDto)
  public readonly attachments: ReadMessageAttachmentDto[];
}
