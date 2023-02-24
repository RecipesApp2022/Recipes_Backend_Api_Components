import { OrderStatusesMigration1662480829263 } from "src/database/migrations/1662480829263-OrderStatusesMigration";
import { Column, Entity, PrimaryColumn } from "typeorm";
import { OrderStatusCode } from "../enums/order-status-code.enum";

@Entity({ name: OrderStatusesMigration1662480829263.tableName })
export class OrderStatus {
    @PrimaryColumn({ name: 'code' })
    public readonly code: OrderStatusCode;

    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'color' })
    public color: string;
}