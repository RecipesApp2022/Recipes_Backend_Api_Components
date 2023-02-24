import { Controller, Get, Query } from '@nestjs/common';
import { PaymentMethod } from 'src/payments/entities/payment-method.entity';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { PaymentMethodsService } from './payment-methods.service';
import { PaymentMethodPaginationPipe } from './pipes/payment-method-pagination.pipe';

@Controller('payment-methods')
export class PaymentMethodsController {
    constructor(private readonly paymentMethods: PaymentMethodsService) {}

    @Get()
    async paginate(@Query(PaymentMethodPaginationPipe) options: any): Promise<PaginationResult<PaymentMethod>> {
        return await this.paymentMethods.paginate(options);
    }
}
