import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethod } from 'src/payments/entities/payment-method.entity';
import { PaymentMethodsController } from './payment-methods.controller';
import { PaymentMethodsService } from './payment-methods.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PaymentMethod,
    ]),
  ],
  controllers: [PaymentMethodsController],
  providers: [PaymentMethodsService]
})
export class PaymentMethodsModule {}
