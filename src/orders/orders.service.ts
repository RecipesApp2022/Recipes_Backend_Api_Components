import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Combo } from 'src/combos/entities/combo.entity';
import { applySort } from 'src/database/utils/sort';
import { PaypalPaymentGateway } from 'src/payment-gateways/paypal-payment-gateway';
import { Payment } from 'src/payments/entities/payment.entity';
import { PaymentMethodCode } from 'src/payments/enums/payment-method-code.enum';
import { Plan } from 'src/plans/entities/plan.entity';
import { Recipe } from 'src/recipes/entities/recipes.entity';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { PdfGenerator } from 'src/support/pdf/pdf-generator';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderCompletedEvent } from './dto/order-completed.event';
import { OrderCreatedEvent } from './dto/order-created.event';
import { OrderPaginationOptionsDto } from './dto/order-pagination-options.dto';
import { PaginateOrdersDto } from './dto/paginate-orders.dto';
import { PayOrderDto } from './dto/pay-order.dto';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';
import { OrderEvent } from './enums/order-event.enum';
import { OrderStatusCode } from './enums/order-status-code.enum';
import { ProductType } from './enums/product-type.enum';
import { OrderAlreadyCapturedException } from './errors/order-already-captured.exception';
import { OrderMustBePendingException } from './errors/order-must-be-pending.exception';
import { OrderNotFoundException } from './errors/order-not-found.exception';
import { PayedAmountMustBeSameAsOrderAmountException } from './errors/payed-amount-must-be-same-as-order-amount.exception';
import { PaymentMethodIsRequiredException } from './errors/payment-method-is-required-exception';
import { ProductNotFoundException } from './errors/product-not-found.exception';
import Handlebars from 'handlebars';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(Recipe)
    private readonly recipesRepository: Repository<Recipe>,
    @InjectRepository(Plan) private readonly plansRepository: Repository<Plan>,
    @InjectRepository(Combo)
    private readonly combosRepository: Repository<Combo>,
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,
    @Inject(PdfGenerator) private readonly pdfGenerator: PdfGenerator,
    private readonly paymentGateway: PaypalPaymentGateway,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async paginate(
    {
      perPage,
      offset,
      filters: { id, clientId, sellerId },
      sort,
    }: OrderPaginationOptionsDto,
    { roleIsClient, roleIsSeller, ...paginateOrdersDto }: PaginateOrdersDto,
  ): Promise<PaginationResult<Order>> {
    const queryBuilder = this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItem')
      .leftJoinAndSelect('orderItem.recipe', 'recipe')
      .leftJoinAndMapOne(
        'recipe.clientRating',
        'recipe.ratings',
        'recipeClientRating',
        'recipeClientRating.itemType = :recipeItemType AND recipeClientRating.itemId = recipe.id AND recipeClientRating.clientId = :loggedClientId',
        {
          recipeItemType: ProductType.RECIPE,
          loggedClientId: paginateOrdersDto.clientId,
        },
      )
      .leftJoinAndSelect('orderItem.plan', 'plan')
      .leftJoinAndMapOne(
        'plan.clientRating',
        'plan.ratings',
        'planClientRating',
        'planClientRating.itemType = :planItemType AND planClientRating.itemId = plan.id AND planClientRating.clientId = :loggedClientId',
        {
          planItemType: ProductType.PLAN,
          loggedClientId: paginateOrdersDto.clientId,
        },
      )
      .leftJoinAndSelect('orderItem.combo', 'combo')
      .leftJoinAndMapOne(
        'combo.clientRating',
        'combo.ratings',
        'comboClientRating',
        'comboClientRating.itemType = :comboItemType AND comboClientRating.itemId = combo.id AND comboClientRating.clientId = :loggedClientId',
        {
          comboItemType: ProductType.COMBO,
          loggedClientId: paginateOrdersDto.clientId,
        },
      )
      .leftJoinAndSelect('order.seller', 'seller')
      .leftJoinAndMapOne(
        'seller.clientRating',
        'seller.sellerRatings',
        'sellerClientRating',
        'sellerClientRating.sellerId = seller.id AND sellerClientRating.clientId = :loggedClientId AND sellerClientRating.orderId = order.id',
        { loggedClientId: paginateOrdersDto.clientId },
      )
      .leftJoinAndSelect('order.client', 'client')
      .leftJoinAndSelect('order.orderStatus', 'orderStatus')
      .leftJoinAndSelect('order.payment', 'payment')
      .leftJoinAndSelect('payment.paymentMethod', 'paymentMethod')
      .take(perPage)
      .skip(offset);

    if (id) queryBuilder.andWhere('order.id = :id', { id });

    if (clientId || roleIsClient)
      queryBuilder.andWhere('order.clientId = :clientId', {
        clientId: roleIsClient ? paginateOrdersDto.clientId : clientId,
      });

    if (sellerId || roleIsSeller)
      queryBuilder.andWhere('order.sellerId = :sellerId', {
        sellerId: roleIsSeller ? paginateOrdersDto.sellerId : sellerId,
      });

    applySort({ sort, entityAlias: 'order', queryBuilder });

    const [orders, total] = await queryBuilder.getManyAndCount();

    return new PaginationResult(orders, total, perPage);
  }

  async create({
    type,
    productId,
    typeIsRecipe,
    typeIsPlan,
    imagesRelationshipName,
    paymentMethodCode,
    clientId,
    ...createOrderDto
  }: CreateOrderDto): Promise<{
    order: Order;
    url: string;
  }> {
    const productRepository = typeIsRecipe
      ? this.recipesRepository
      : typeIsPlan
      ? this.plansRepository
      : this.combosRepository;

    const product = await productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect(`product.${imagesRelationshipName}`, 'images')
      .leftJoinAndSelect(`product.seller`, 'seller')
      .where('product.id = :productId', { productId })
      .getOne();

    if (!product) {
      throw new ProductNotFoundException();
    }

    const order = Order.create({
      ...createOrderDto,
      clientId,
      sellerId: product.seller.id,
      orderItems: [OrderItem.createFromProduct(product)],
      orderStatusCode:
        product.price == 0
          ? OrderStatusCode.COMPLETED
          : OrderStatusCode.PENDING,
    });

    if (product.price > 0 && !paymentMethodCode) {
      throw new PaymentMethodIsRequiredException();
    } else {
      order.paymentMethodCode = paymentMethodCode;
    }

    const savedOrder = await this.ordersRepository.save(order);

    this.eventEmitter.emit(
      OrderEvent.ORDER_CREATED,
      new OrderCreatedEvent({
        orderId: order.id,
        sellerId: order.sellerId,
      }),
    );

    let url: string = null;

    const paymentMethodIsPaypal =
      paymentMethodCode === PaymentMethodCode.PAYPAL;

    if (order.total > 0 && paymentMethodIsPaypal) {
      url = await this.paymentGateway.getPaymentUrl(savedOrder);
    }

    if (savedOrder.isCompleted) {
      this.eventEmitter.emit(
        OrderEvent.ORDER_COMPLETED,
        new OrderCompletedEvent(clientId, {
          id: savedOrder.id,
          orderItems: savedOrder.orderItems,
        }),
      );
    }

    return {
      order: savedOrder,
      url,
    };
  }

  async findOne({
    id,
    roleIsClient,
    roleIsSeller,
    clientId,
    sellerId,
  }: PaginateOrdersDto & { id: number }): Promise<Order> {
    const queryBuilder = this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItem')
      .leftJoinAndSelect('orderItem.recipe', 'recipe')
      .leftJoinAndMapOne(
        'recipe.clientRating',
        'recipe.ratings',
        'recipeClientRating',
        'recipeClientRating.itemType = :recipeItemType AND recipeClientRating.itemId = recipe.id AND recipeClientRating.clientId = :clientId',
        { recipeItemType: ProductType.RECIPE, clientId },
      )
      .leftJoinAndSelect('orderItem.plan', 'plan')
      .leftJoinAndMapOne(
        'plan.clientRating',
        'plan.ratings',
        'planClientRating',
        'planClientRating.itemType = :planItemType AND planClientRating.itemId = plan.id AND planClientRating.clientId = :clientId',
        { planItemType: ProductType.PLAN, clientId },
      )
      .leftJoinAndSelect('orderItem.combo', 'combo')
      .leftJoinAndMapOne(
        'combo.clientRating',
        'combo.ratings',
        'comboClientRating',
        'comboClientRating.itemType = :comboItemType AND comboClientRating.itemId = combo.id AND comboClientRating.clientId = :clientId',
        { comboItemType: ProductType.COMBO, clientId },
      )
      .leftJoinAndSelect('order.seller', 'seller')
      .leftJoinAndMapOne(
        'seller.clientRating',
        'seller.sellerRatings',
        'sellerClientRating',
        'sellerClientRating.sellerId = seller.id AND sellerClientRating.clientId = :clientId AND sellerClientRating.orderId = order.id',
        { clientId },
      )
      .leftJoinAndSelect('order.client', 'client')
      .leftJoinAndSelect('order.orderStatus', 'orderStatus')
      .leftJoinAndSelect('order.payment', 'payment')
      .leftJoinAndSelect('payment.paymentMethod', 'paymentMethod')
      .where('order.id = :id', { id });

    if (roleIsClient) {
      queryBuilder.andWhere('order.clientId = :clientId', { clientId });
    } else if (roleIsSeller) {
      queryBuilder.andWhere('order.sellerId = :sellerId', { sellerId });
    }

    const order = await queryBuilder.getOne();

    if (!order) {
      throw new OrderNotFoundException();
    }

    return order;
  }

  async captureOrder(paypalOrderId: string): Promise<Order> {
    let orderId: number;
    let totalPayed = 0;

    try {
      const data = await this.paymentGateway.captureOrder(paypalOrderId);
      orderId = data.orderId;
      totalPayed = data.totalPayed;
    } catch (e) {
      throw new OrderAlreadyCapturedException();
    }

    const order = await this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItem')
      .leftJoinAndSelect('order.client', 'client')
      .leftJoinAndSelect('order.paymentMethod', 'paymentMethod')
      .where('order.id = :orderId', { orderId })
      .getOne();

    if (!order) {
      throw new OrderNotFoundException();
    }

    if (order.total !== totalPayed) {
      throw new PayedAmountMustBeSameAsOrderAmountException();
    }

    order.orderStatusCode = OrderStatusCode.COMPLETED;

    const payment = Payment.create({
      amount: totalPayed,
      order,
      client: order.client,
      paymentMethodCode: order.paymentMethod.code,
    });

    await this.paymentsRepository.save(payment);

    const savedOrder = await this.ordersRepository.save(order);

    if (savedOrder.isCompleted) {
      this.eventEmitter.emit(
        OrderEvent.ORDER_COMPLETED,
        new OrderCompletedEvent(order.client.userId, {
          id: savedOrder.id,
          orderItems: savedOrder.orderItems,
        }),
      );
    }

    return savedOrder;
  }

  async payPendingOrder({
    id,
    clientId,
  }: PayOrderDto): Promise<{ order: Order; url: string }> {
    const order = await this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItem')
      .leftJoinAndSelect('order.orderStatus', 'orderStatus')
      .where('order.id = :id', { id })
      .andWhere('order.clientId = :clientId', { clientId })
      .andWhere('order.paymentMethodCode = :paymentMethodCode', {
        paymentMethodCode: PaymentMethodCode.PAYPAL,
      })
      .getOne();

    if (!order) {
      throw new OrderNotFoundException();
    }

    if (!order.isPending) {
      throw new OrderMustBePendingException('You cannot pay the order');
    }

    const url = await this.paymentGateway.getPaymentUrl(order);

    return {
      order,
      url,
    };
  }

  async orderDetailsPdf({
    id,
    roleIsClient,
    roleIsSeller,
    clientId,
    sellerId,
  }: PaginateOrdersDto & { id: number }): Promise<Buffer> {
    const queryBuilder = this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItem')
      .leftJoinAndSelect('orderItem.recipe', 'recipe')
      .leftJoinAndSelect('orderItem.plan', 'plan')
      .leftJoinAndSelect('orderItem.combo', 'combo')
      .leftJoinAndSelect('order.seller', 'seller')
      .leftJoinAndSelect('order.client', 'client')
      .leftJoinAndSelect('client.user', 'user')
      .leftJoinAndSelect('order.orderStatus', 'orderStatus')
      .leftJoinAndSelect('order.payment', 'payment')
      .leftJoinAndSelect('payment.paymentMethod', 'paymentMethod')
      .where('order.id = :id', { id });

    if (roleIsClient) {
      queryBuilder.andWhere('order.clientId = :clientId', { clientId });
    } else if (roleIsSeller) {
      queryBuilder.andWhere('order.sellerId = :sellerId', { sellerId });
    }

    const order = await queryBuilder.getOne();

    if (!order) {
      throw new OrderNotFoundException();
    }

    Handlebars.registerHelper('inc', function (n) {
      return Number(n) + 1;
    });

    const template = Handlebars.compile(
      readFileSync(
        join(__dirname, '..', '..', '..', 'templates', 'order-details.hbs'),
      ).toString(),
    );

    const content = template(
      { order },
      { allowedProtoProperties: { formattedCreatedAt: true, total: true } },
    );

    return await this.pdfGenerator.generate({ content });
  }
}
