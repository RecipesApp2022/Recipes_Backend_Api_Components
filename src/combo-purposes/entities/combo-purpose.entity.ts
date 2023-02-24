import { ComboPurposesMigration1654116963912 } from "src/database/migrations/1654116963912-ComboPurposesMigration";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: ComboPurposesMigration1654116963912.tableName })
export class ComboPurpose {
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

    static create(data: Partial<ComboPurpose>): ComboPurpose {
        return Object.assign(new ComboPurpose(), data);
    }
}