import { PaymentMethodCode } from "src/payments/enums/payment-method-code.enum";
import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";
import { PaymentMethodsMigration1663081872170 } from "./1663081872170-PaymentMethodsMigration";

export class AddImageAndLogoToPaymentMethodsMigration1663174306594 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns(PaymentMethodsMigration1663081872170.tableName, [
            new TableColumn({
                name: 'image',
                type: 'varchar',
            }),
            new TableColumn({
                name: 'logo',
                type: 'varchar',
            }),
        ]);

        await queryRunner.query(`
            UPDATE \`${PaymentMethodsMigration1663081872170.tableName}\`
            SET
                \`image\` = 'uploads/payment-methods/paypal.png',
                \`logo\` = 'uploads/payment-methods/paypal-logo.png'
            WHERE
                \`code\` = '${PaymentMethodCode.PAYPAL}'
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns(PaymentMethodsMigration1663081872170.tableName, ['image', 'logo']);
    }

}
