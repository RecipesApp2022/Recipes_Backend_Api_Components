import { PaymentMethodsMigration1663081872170 } from "src/database/migrations/1663081872170-PaymentMethodsMigration";
import { Column, Entity, PrimaryColumn } from "typeorm";
import { PaymentMethodCode } from "../enums/payment-method-code.enum";

@Entity({ name: PaymentMethodsMigration1663081872170.tableName })
export class PaymentMethod {
    @PrimaryColumn({ name: 'code' })
    public readonly code: PaymentMethodCode;

    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'image' })
    public image: string;

    @Column({ name: 'logo' })
    public logo: string;
}