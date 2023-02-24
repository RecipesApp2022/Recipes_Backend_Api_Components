import { Body, Controller, Get, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtUserToBodyInterceptor } from 'src/support/interceptors/jwt-user-to-body.interceptor';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Role } from 'src/users/enums/role.enum';
import { ReadPurchasedProductDto } from './dto/read-purchased-product.dto';
import { PurchasedProductPaginationPipe } from './pipes/purchased-product-pagination.pipe';
import { PurchasedProductsService } from './purchased-products.service';

@Controller('purchased-products')
export class PurchasedProductsController {
    constructor(private readonly purchasedProductsService: PurchasedProductsService) {}

    @Get()
    @Roles(Role.CLIENT)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(new JwtUserToBodyInterceptor('clientId'))
    async paginate(
        @Query(PurchasedProductPaginationPipe) options: any,
        @Body('clientId') clientId: number
    ): Promise<PaginationResult<ReadPurchasedProductDto>> {
        return (await this.purchasedProductsService.paginate(options, clientId)).toClass(ReadPurchasedProductDto);
    }
}
