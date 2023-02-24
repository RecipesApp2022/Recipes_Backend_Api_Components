import { MealPeriodsMigration1652472801117 } from "src/database/migrations/1652472801117-MealPeriodsMigration";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: MealPeriodsMigration1652472801117.tableName })
export class MealPeriod {
    @PrimaryGeneratedColumn({ name: 'id' })
    public readonly id: number;

    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'icon' })
    public icon: string;

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

    static create(data: Partial<MealPeriod>): MealPeriod {
        return Object.assign(new MealPeriod(), data);
    }
}