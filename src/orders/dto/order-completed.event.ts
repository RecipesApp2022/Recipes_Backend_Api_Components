import { PurchasedProductType } from "src/purchased-products/types/purchased-product-type";

export class OrderCompletedEvent {
    constructor(
        public readonly clientId: number,
        public readonly order: {
            id: number;
            orderItems: {
                productId: number;
                type: PurchasedProductType;
            }[];
        }
    ) {}
}