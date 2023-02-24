import { Body, Controller, Get, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtUserToBodyInterceptor } from 'src/support/interceptors/jwt-user-to-body.interceptor';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Role } from 'src/users/enums/role.enum';
import { RateSellerDto } from './dto/rate-seller.dto';
import { ReadSellerRatingDto } from './dto/read-seller-rating.dto';
import { SellerRatingPaginationPipe } from './pipes/seller-rating-pagination.pipe';
import { SellerRatingsService } from './seller-ratings.service';

@Controller('seller-ratings')
export class SellerRatingsController {
    constructor(private readonly sellerRatingsService: SellerRatingsService) {}

    @Get()
    async paginate(@Query(SellerRatingPaginationPipe) options: any): Promise<PaginationResult<ReadSellerRatingDto>> {
        return (await this.sellerRatingsService.paginate(options)).toClass(ReadSellerRatingDto);
    }
    
    @Post()
    @Roles(Role.CLIENT)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(new JwtUserToBodyInterceptor('clientId'))
    async rateSeller(@Body() rateSellerDto: RateSellerDto): Promise<ReadSellerRatingDto> {
        return plainToClass(ReadSellerRatingDto, await this.sellerRatingsService.rateSeller(rateSellerDto));
    }
}
