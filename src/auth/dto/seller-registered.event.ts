export class SellerRegisteredEvent {
  public readonly userId: number;
  public readonly sellerId: number;
  public readonly sellerSlug: string;

  constructor(data: Omit<SellerRegisteredEvent, ''>) {
    Object.assign(this, data);
  }
}
