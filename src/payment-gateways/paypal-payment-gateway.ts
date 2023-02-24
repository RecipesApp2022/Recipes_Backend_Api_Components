import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";
import { Order } from "src/orders/entities/order.entity";

@Injectable()
export class PaypalPaymentGateway {
    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) {}

    private get config() {
        return {
            clientId: this.configService.get<string>('PAYPAL_CLIENT'),
            clientSecret: this.configService.get<string>('PAYPAL_SECRET'),
            paypalApi: this.configService.get<string>('PAYPAL_API'),
            returnUrl: this.configService.get<string>('PAYPAL_RETURN_URL'),
            cancelUrl: this.configService.get<string>('PAYPAL_CANCEL_URL'),
        }
    }

    async getPaymentUrl(order: Order): Promise<string> {
        const paypalOrder = this.buildPaypalOrder(order);
        
        const url = `${this.config.paypalApi}/v2/checkout/orders`;
        
        const { data } = await this.httpService.axiosRef.post(url, paypalOrder, {
            auth: {
                username: this.config.clientId,
                password: this.config.clientSecret,
            },
        });
        
        return data.links.find((link: { rel: string; }) => link.rel === 'approve').href;
    }

    private buildPaypalOrder(order: Order) {
        const orderItem = order.orderItems?.[0];

        return {
            intent: 'CAPTURE',
            purchase_units: [
                {
                    reference_id: order.id,
                    amount: {
                        currency_code: 'USD',
                        value: order.total,
                    },
                    description: orderItem.name,
                }
            ],
            application_context: {
                brand_name: 'Rick recipes',
                user_action: 'PAY_NOW',
                return_url: this.config.returnUrl,
                cancel_url: this.config.cancelUrl,
            },
        };
    }

    async captureOrder(orderId: string): Promise<{
        orderId: number;
        totalPayed: number;
    }> {
        const url = `${this.config.paypalApi}/v2/checkout/orders/${orderId}/capture`;
        
        const { data } = await this.httpService.axiosRef.post(url, {}, {
            auth: {
                username: this.config.clientId,
                password: this.config.clientSecret,
            },
        });
        
        const { reference_id, payments } = data.purchase_units[0];

        const totalPayed = payments.captures
            .filter(payment => payment.status === 'COMPLETED')
            .reduce((total, payment) => total + Number(payment.amount.value), 0);
        
        return {
            orderId: Number(reference_id),
            totalPayed,
        };
    }
}