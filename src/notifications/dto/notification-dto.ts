import { NotificationTypeCode } from '../enum/notification-type-code.enum';

export interface NotificationDto {
  id: number;
  message: string;
  type: NotificationTypeCode;
  additionalData?: Record<string, any>;
  createdAt: string;
}
