import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Combo } from 'src/combos/entities/combo.entity';
import { PaymentGatewaysModule } from 'src/payment-gateways/payment-gateways.module';
import { Payment } from 'src/payments/entities/payment.entity';
import { Plan } from 'src/plans/entities/plan.entity';
import { Recipe } from 'src/recipes/entities/recipes.entity';
import { Seller } from 'src/sellers/entities/seller.entity';
import { HpnPdfGenerator } from 'src/support/pdf/hpn-pdf-generator';
import { PdfGenerator } from 'src/support/pdf/pdf-generator';
import { Order } from './entities/order.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      Recipe,
      Plan,
      Combo,
      Payment,
      Seller,
    ]),
    PaymentGatewaysModule,
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    {
      provide: PdfGenerator,
      useClass: HpnPdfGenerator,
    },
  ]
})
export class OrdersModule {}
