import { PaymentMethodCode } from "src/payments/enums/payment-method-code.enum";
import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";
import { OrdersMigration1662480829264 } from "./1662480829264-OrdersMigration";
import { PaymentsMigration1663081925449 } from "./1663081925449-PaymentsMigration";

export class AddPaymentMethodCodeToOrdersMigration1663263669358 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const { tableName: ordersTable } = OrdersMigration1662480829264;
        const { tableName: paymentsTable } = PaymentsMigration1663081925449;
        
        await queryRunner.addColumn(ordersTable, new TableColumn({
            name: 'payment_method_code',
            type: 'varchar',
            length: '7',
            isNullable: true,
        }));

        await queryRunner.query(`
            UPDATE
                \`${ordersTable}\`
            SET
                \`payment_method_code\` = '${PaymentMethodCode.PAYPAL}'
            WHERE
                EXISTS(
                    SELECT
                        1
                    FROM
                        \`${paymentsTable}\`
                    WHERE
                        \`${paymentsTable}\`.\`order_id\` = \`${ordersTable}\`.\`id\` AND
                        \`${paymentsTable}\`.\`payment_method_code\` = '${PaymentMethodCode.PAYPAL}'
                )
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn(OrdersMigration1662480829264.tableName, 'payment_method_code');
    }

}
