import { RecipeDifficultiesMigration1652477663062 } from "src/database/migrations/1652477663062-RecipeDifficultiesMigration";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: RecipeDifficultiesMigration1652477663062.tableName })
export class RecipeDifficulty {
    @PrimaryGeneratedColumn({ name: 'id' })
    public readonly id: number;

    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'value' })
    public value: number;

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

    static create(data: Partial<RecipeDifficulty>): RecipeDifficulty {
        return Object.assign(new RecipeDifficulty(), data);
    }
}