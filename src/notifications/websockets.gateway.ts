import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Role } from 'src/users/enums/role.enum';
import { NotificationDto } from './dto/notification-dto';

@WebSocketGateway()
export class WebsocketsGateway {
  @WebSocketServer()
  protected server: Server;

  public notifyByUserIds(ids: number[], notification: NotificationDto) {
    for (const id of ids) {
      this.server.emit(`user.${id}`, notification);
    }
  }

  public notifyByUserRole(roles: Role[], notification: NotificationDto) {
    for (const role of roles) {
      this.server.emit(role, notification);
    }
  }
}
