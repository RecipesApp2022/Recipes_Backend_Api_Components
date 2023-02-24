export class EmailContactCreatedEvent {
  constructor(public readonly email: string, public readonly content: string) {}
}
