import { AdPositionsMigration1654798454692 } from "src/database/migrations/1654798454692-AdPositionsMigration";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: AdPositionsMigration1654798454692.tableName })
export class AdPosition {
    @PrimaryGeneratedColumn({ name: 'id' })
    public readonly id: number;

    @Column({ name: 'name' })
    public name: string;
}