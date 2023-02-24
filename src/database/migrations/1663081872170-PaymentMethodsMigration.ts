import { PaymentMethodCode } from "src/payments/enums/payment-method-code.enum";
import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class PaymentMethodsMigration1663081872170 implements MigrationInterface {

    public static readonly tableName = 'payment_methods';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: PaymentMethodsMigration1663081872170.tableName,
            columns: [
                {
                    name: 'code',
                    type: 'varchar',
                    length: '7',
                },
                {
                    name: 'name',
                    type: 'varchar',
                },
            ],
        }));

        await queryRunner.query(`
            INSERT INTO \`${PaymentMethodsMigration1663081872170.tableName}\`
                (\`code\`, \`name\`)
            VALUES
                ('${PaymentMethodCode.PAYPAL}', 'paypal')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(PaymentMethodsMigration1663081872170.tableName);
    }

}
