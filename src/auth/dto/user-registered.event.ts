export class UserRegisteredEvent {
  public readonly userId: number;

  constructor(data: Omit<UserRegisteredEvent, ''>) {
    Object.assign(this, data);
  }
}
