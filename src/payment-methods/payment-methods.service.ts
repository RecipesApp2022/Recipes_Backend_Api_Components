import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentMethod } from 'src/payments/entities/payment-method.entity';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { PaymentMethodPaginationOptionsDto } from './dto/payment-method-pagination-options.dto';

@Injectable()
export class PaymentMethodsService {
    constructor(@InjectRepository(PaymentMethod) private readonly paymentMethodsRepository: Repository<PaymentMethod>) {}

    async paginate({perPage, offset, filters: {
        id,
        name,
    }}: PaymentMethodPaginationOptionsDto): Promise<PaginationResult<PaymentMethod>> {
        const queryBuilder = this.paymentMethodsRepository.createQueryBuilder('paymentMethod')
            .take(perPage)
            .skip(offset);

        if (id) queryBuilder.andWhere('paymentMethod.id = :id', { id });

        if (name) queryBuilder.andWhere('paymentMethod.name LIKE :name', { name: `%${name}%` });

        const [paymentMethods, total] = await queryBuilder.getManyAndCount();

        return new PaginationResult(paymentMethods, total, perPage);
    }
}
