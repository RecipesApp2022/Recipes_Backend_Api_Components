import { OccupationsMigration1652816376221 } from "src/database/migrations/1652816376221-OccupationsMigration";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: OccupationsMigration1652816376221.tableName })
export class Occupation {
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
        select: false,
    })
    public deletedAt: Date;

    static create(data: Partial<Occupation>): Occupation {
        return Object.assign(new Occupation(), data);
    }
}