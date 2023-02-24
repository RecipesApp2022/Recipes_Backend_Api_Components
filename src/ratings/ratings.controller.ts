import { Body, Controller, Get, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtUserToBodyInterceptor } from 'src/support/interceptors/jwt-user-to-body.interceptor';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Role } from 'src/users/enums/role.enum';
import { RateProductDto } from './dto/rate-product.dto';
import { ReadRatingDto } from './dto/read-rating.dto';
import { RatingPaginationPipe } from './pipes/rating-pagination.pipe';
import { RatingsService } from './ratings.service';

@Controller('ratings')
export class RatingsController {
    constructor(private readonly ratingsService: RatingsService) {}

    @Get()
    async paginate(@Query(RatingPaginationPipe) options: any): Promise<PaginationResult<ReadRatingDto>> {
        return (await this.ratingsService.paginate(options)).toClass(ReadRatingDto);
    }

    @Post()
    @Roles(Role.CLIENT)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseInterceptors(new JwtUserToBodyInterceptor('clientId'))
    async rateProduct(@Body() rateProductDto: RateProductDto): Promise<ReadRatingDto> {
        return plainToClass(ReadRatingDto, await this.ratingsService.rateProduct(rateProductDto));
    }
}
