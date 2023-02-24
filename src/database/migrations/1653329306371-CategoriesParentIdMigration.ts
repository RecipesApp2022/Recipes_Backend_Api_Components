import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";
import { CategoriesMigration1652383834009 } from "./1652383834009-CategoriesMigration";

type Category = {
    name: string;
    children: Category[];
}

const makeCategory = (name: string, children: Category[] = []): Category => ({ name, children });

export class CategoriesParentIdMigration1653329306371 implements MigrationInterface {

    protected categories: Category[] = [
        makeCategory('High in protein', [
            makeCategory('Legumbres', [makeCategory('Garbanzos')]),
            makeCategory('Frutos secos', [makeCategory('Postres orientales ')]),
            makeCategory('Lacteos', [makeCategory('Yogures')]),
        ]),
        makeCategory('Paleo', [
            makeCategory('Comida de mar', [makeCategory('Salsas'), makeCategory('Moluscos'), makeCategory('Crustaceos')]),
            makeCategory('Carnes magras', [makeCategory('Al horno'), makeCategory('En salsa')]),
            makeCategory('Vegetales', [makeCategory('Combinados')]),
        ]),
        makeCategory('Vegan ', [
            makeCategory('Integrales', [makeCategory('Cereales')]),
            makeCategory('Vegetales', [makeCategory('Orgánicos')]),
            makeCategory('Lactoovovegetariano', [makeCategory('Bebidas'), makeCategory('Comidas completas')]),
        ]),
        makeCategory('Fitness', [
            makeCategory('Batidos', [makeCategory('Proteicos'), makeCategory('Suplementos')]),
            makeCategory('Ensaladas', [makeCategory('Crudas'), makeCategory('Cocidas')]),
            makeCategory('Detox', [makeCategory('Jugos Desintoxicantes')]),
        ]),
        makeCategory('Mediterranea', [
            makeCategory('Alto en fibra', [makeCategory('Fibra soluble')]),
            makeCategory('Mariscos', [makeCategory('Afrodisiacos')]),
            makeCategory('Enteras', [makeCategory('Naturales')]),
        ]),
    ];

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(CategoriesMigration1652383834009.tableName, new TableColumn({
            name: 'parent_id',
            type: 'int',
            isNullable: true,
        }));

        await queryRunner.createForeignKey(CategoriesMigration1652383834009.tableName, new TableForeignKey({
            columnNames: ['parent_id'],
            referencedColumnNames: ['id'],
            referencedTableName: CategoriesMigration1652383834009.tableName,
            onDelete: 'SET NULL',
        }));

        this.categories.forEach(category => this.insertCategory(queryRunner, category));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable(CategoriesMigration1652383834009.tableName);
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('parent_id') !== -1);

        await queryRunner.dropForeignKey(CategoriesMigration1652383834009.tableName, foreignKey);
        await queryRunner.dropColumn(CategoriesMigration1652383834009.tableName, 'parent_id');
    }

    protected async insertCategory(queryRunner: QueryRunner, category: Category, parentCategoryName: string = null): Promise<void> {
        const subTable = `sub${CategoriesMigration1652383834009.tableName}`;
        
        await queryRunner.query(`
            INSERT INTO \`${CategoriesMigration1652383834009.tableName}\`
                (\`name\`, \`banner\`, \`app_logo\`, \`parent_id\`)
            VALUES
                ('${category.name}', 'uploads/categories/banner.jpg', 'uploads/categories/app-logo.png', (
                    SELECT
                        \`${subTable}\`.\`id\`
                    FROM
                        \`${CategoriesMigration1652383834009.tableName}\` as \`${subTable}\`
                    WHERE
                        \`${subTable}\`.\`name\` = '${parentCategoryName}'
                    LIMIT
                        1
                ))
        `);

        category.children.forEach(_category => this.insertCategory(queryRunner, _category, category.name));
    }

}
