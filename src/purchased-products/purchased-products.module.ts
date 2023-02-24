import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchasedProduct } from './entities/purchased-product.entity';
import { OrderCompletedListener } from './listeners/order-completed.listener';
import { PurchasedProductsController } from './purchased-products.controller';
import { PurchasedProductsService } from './purchased-products.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PurchasedProduct,
    ]),
  ],
  controllers: [PurchasedProductsController],
  providers: [PurchasedProductsService, OrderCompletedListener],
})
export class PurchasedProductsModule {}
