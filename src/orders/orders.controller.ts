import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Response } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ReadPaymentDto } from 'src/payments/dto/read-payment.dto';
import { JwtUserToBodyInterceptor } from 'src/support/interceptors/jwt-user-to-body.interceptor';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { SellerIdToBodyInterceptor } from 'src/support/interceptors/seller-id-to-body.interceptor';
import { UserRoleToBodyInterceptor } from 'src/support/interceptors/user-role-to-body.interceptor';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Role } from 'src/users/enums/role.enum';
import { Readable } from 'stream';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaginateOrdersDto } from './dto/paginate-orders.dto';
import { PayOrderDto } from './dto/pay-order.dto';
import { ReadOrderDto } from './dto/read-order.dto';
import { Order } from './entities/order.entity';
import { OrdersService } from './orders.service';
import { OrderPaginationPipe } from './pipes/order-pagination.pipe';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @Roles(Role.CLIENT, Role.SELLER, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(
    new UserRoleToBodyInterceptor(),
    SellerIdToBodyInterceptor,
    new JwtUserToBodyInterceptor('clientId'),
  )
  async paginate(
    @Query(OrderPaginationPipe) options: any,
    @Body() paginateOrdersDto: PaginateOrdersDto,
  ): Promise<PaginationResult<ReadOrderDto>> {
    return (
      await this.ordersService.paginate(options, paginateOrdersDto)
    ).toClass(ReadOrderDto);
  }

  @Post()
  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor('clientId'))
  async create(
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<{ order: ReadOrderDto; url: string }> {
    const { order, url } = await this.ordersService.create(createOrderDto);

    return {
      order: plainToClass(ReadOrderDto, order),
      url,
    };
  }

  @Get(':id(\\d+)')
  @Roles(Role.CLIENT, Role.SELLER, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(
    new UserRoleToBodyInterceptor(),
    SellerIdToBodyInterceptor,
    new JwtUserToBodyInterceptor('clientId'),
  )
  async findOne(
    @Param('id') id: string,
    @Body() paginateOrdersDto: PaginateOrdersDto,
  ): Promise<ReadOrderDto> {
    return plainToClass(
      ReadOrderDto,
      await this.ordersService.findOne(
        Object.assign(paginateOrdersDto, { id: +id }),
      ),
    );
  }

  @Get('/capture-order')
  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async captureOrder(@Query('token') orderId: string): Promise<ReadOrderDto> {
    return plainToClass(ReadOrderDto, this.ordersService.captureOrder(orderId));
  }

  @Post(':id/pay')
  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(
    new JwtUserToBodyInterceptor('clientId'),
    new ParamsToBodyInterceptor({ id: 'id' }),
  )
  async payOrder(
    @Body() payOrderDto: PayOrderDto,
  ): Promise<{ order: ReadOrderDto; url: string }> {
    const { order, url } = await this.ordersService.payPendingOrder(
      payOrderDto,
    );

    return {
      order: plainToClass(ReadOrderDto, order),
      url,
    };
  }

  @Get(':id/pdf')
  @Roles(Role.CLIENT, Role.SELLER, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(
    new UserRoleToBodyInterceptor(),
    SellerIdToBodyInterceptor,
    new JwtUserToBodyInterceptor('clientId'),
    new ParamsToBodyInterceptor({ id: 'id' }),
  )
  async orderDetailsPdf(
    @Res() res: Response,
    @Body() paginateOrdersDto: PaginateOrdersDto & { id: number },
  ): Promise<void> {
    const buffer = await this.ordersService.orderDetailsPdf(paginateOrdersDto);
    const stream = new Readable();

    stream.push(buffer);
    stream.push(null);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': buffer.length,
    });

    stream.pipe(res);
  }
}
