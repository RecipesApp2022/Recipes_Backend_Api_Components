import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
import { SellersMigration1651861624218 } from './1651861624218-SellersMigration';
import { RecipesMigration1652967102617 } from './1652967102617-RecipesMigration';
import { RecipeImagesMigration1652970120308 } from './1652970120308-RecipeImagesMigration';
import { PlansMigration1653679992221 } from './1653679992221-PlansMigration';
import { CombosMigration1654123467552 } from './1654123467552-CombosMigration';

export class MakeRatingsFloatMigration1666378378340
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      RecipesMigration1652967102617.tableName,
      'rating',
      new TableColumn({
        name: 'rating',
        type: 'float',
        isNullable: true,
      }),
    );

    await queryRunner.changeColumn(
      PlansMigration1653679992221.tableName,
      'rating',
      new TableColumn({
        name: 'rating',
        type: 'float',
        isNullable: true,
      }),
    );

    await queryRunner.changeColumn(
      CombosMigration1654123467552.tableName,
      'rating',
      new TableColumn({
        name: 'rating',
        type: 'float',
        isNullable: true,
      }),
    );

    await queryRunner.changeColumn(
      SellersMigration1651861624218.tableName,
      'rating',
      new TableColumn({
        name: 'rating',
        type: 'float',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      RecipesMigration1652967102617.tableName,
      'rating',
      new TableColumn({
        name: 'rating',
        type: 'tinyint',
        isNullable: true,
      }),
    );

    await queryRunner.changeColumn(
      PlansMigration1653679992221.tableName,
      'rating',
      new TableColumn({
        name: 'rating',
        type: 'tinyint',
        isNullable: true,
      }),
    );

    await queryRunner.changeColumn(
      CombosMigration1654123467552.tableName,
      'rating',
      new TableColumn({
        name: 'rating',
        type: 'tinyint',
        isNullable: true,
      }),
    );

    await queryRunner.changeColumn(
      SellersMigration1651861624218.tableName,
      'rating',
      new TableColumn({
        name: 'rating',
        type: 'tinyint',
        isNullable: true,
      }),
    );
  }
}
