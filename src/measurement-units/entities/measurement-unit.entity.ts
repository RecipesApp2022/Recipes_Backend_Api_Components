import { MeasurementUnitsMigration1652327347069 } from "src/database/migrations/1652327347069-MeasurementUnitsMigration";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: MeasurementUnitsMigration1652327347069.tableName })
export class MeasurementUnit {
    @PrimaryGeneratedColumn({ name: 'id' })
    public readonly id: number;

    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'abbreviation' })
    public abbreviation: string;
    
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

    static create(data: Partial<MeasurementUnit>): MeasurementUnit {
        return Object.assign(new MeasurementUnit(), data);
    }
}