import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PaypalPaymentGateway } from './paypal-payment-gateway';

@Module({
    imports: [HttpModule],
    providers: [PaypalPaymentGateway],
    exports: [PaypalPaymentGateway],
})
export class PaymentGatewaysModule {}
