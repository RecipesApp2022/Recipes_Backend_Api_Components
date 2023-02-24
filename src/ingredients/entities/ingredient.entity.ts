import { IngredientsMigration1652479309805 } from "src/database/migrations/1652479309805-IngredientsMigration";
import { IngredientType } from "src/ingredient-types/entities/ingredient-type.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: IngredientsMigration1652479309805.tableName })
export class Ingredient {
    @PrimaryGeneratedColumn({ name: 'id' })
    public readonly id: number;

    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'icon' })
    public icon: string;

    @Column({ name: 'ingredient_type_id', select: false })
    public ingredientTypeId: number;

    @ManyToOne(() => IngredientType)
    @JoinColumn({ name: 'ingredient_type_id' })
    public ingredientType: IngredientType;
    
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

    static create(data: Partial<Ingredient>): Ingredient {
        return Object.assign(new Ingredient(), data);
    }
}