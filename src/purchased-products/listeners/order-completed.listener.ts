import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderCompletedEvent } from "src/orders/dto/order-completed.event";
import { OrderEvent } from "src/orders/enums/order-event.enum";
import { Repository } from "typeorm";
import { PurchasedProduct } from "../entities/purchased-product.entity";

@Injectable()
export class OrderCompletedListener {
    constructor(@InjectRepository(PurchasedProduct) private readonly purchasedProductsRepository: Repository<PurchasedProduct>) {}
    
    @OnEvent(OrderEvent.ORDER_COMPLETED)
    async handleOrderCompletedEvent({ clientId, order }: OrderCompletedEvent) {
        const purchasedProducts = await Promise.all(order.orderItems.map(async ({ productId, type }) => {
            const purchasedProductCount = await this.purchasedProductsRepository.createQueryBuilder('purchasedProduct')
                .where('purchasedProduct.clientId = :clientId', { clientId })
                .andWhere('purchasedProduct.type = :type', { type })
                .andWhere('purchasedProduct.productId = :productId', { productId })
                .getCount();

            if (purchasedProductCount > 0 ) {
                return null;
            }
            
            return PurchasedProduct.create({
                clientId,
                productId: productId,
                type: type,
            });
        }));

        const filteredPurchasedProducts = purchasedProducts.filter(item => item !== null);

        await this.purchasedProductsRepository.save(filteredPurchasedProducts);
    }
}