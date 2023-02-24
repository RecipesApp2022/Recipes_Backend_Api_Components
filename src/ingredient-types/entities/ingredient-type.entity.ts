import { IngredientTypesMigration1652327287530 } from "src/database/migrations/1652327287530-IngredientTypesMigration";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: IngredientTypesMigration1652327287530.tableName })
export class IngredientType {
    @PrimaryGeneratedColumn({ name: 'id' })
    public readonly id: number;

    @Column({ name: 'name' })
    public name: string;

    @CreateDateColumn({
        name: 'created_at',
    })
    public createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        select: false,
    })
    public updatedAt: Date;

    @DeleteDateColumn({
        name: 'deleted_at',
        select: false
    })
    public deletedAt: Date;

    static create(data: Partial<IngredientType>): IngredientType {
        return Object.assign(new IngredientType(), data);
    }
}