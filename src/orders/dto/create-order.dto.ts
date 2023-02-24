import { Exclude, Expose, Type } from "class-transformer";
import { IsIn, IsNumber, ValidateIf } from "class-validator";
import { PaymentMethodCode, PaymentMethodCodeValues } from "src/payments/enums/payment-method-code.enum";
import { ProductType, ProductTypeValues } from "../enums/product-type.enum";

@Exclude()
export class  CreateOrderDto {
    @Expose()
    public readonly clientId: number;

    @Expose()
    @ValidateIf((obj) => obj.paymentMethodCode)
    @IsIn(PaymentMethodCodeValues)
    public readonly paymentMethodCode: PaymentMethodCode;
    
    @Expose()
    @Type(() => Number)
    @IsNumber()
    public readonly productId: number;

    @Expose()
    @IsIn(ProductTypeValues)
    public readonly type: ProductType;

    public get typeIsRecipe(): boolean {
        return this.type === ProductType.RECIPE;
    }

    public get typeIsPlan(): boolean {
        return this.type === ProductType.PLAN;
    }

    public get imagesRelationshipName(): string {
        return `${this.type.toLocaleLowerCase()}Images`;
    }
}