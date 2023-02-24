import { ComboImagesMigration1654181280077 } from "src/database/migrations/1654181280077-ComboImagesMigration";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Combo } from "./combo.entity";

@Entity({ name: ComboImagesMigration1654181280077.tableName })
export class ComboImage {
    @PrimaryGeneratedColumn({ name: 'id' })
    public readonly id: number;

    @Column({ name: 'path' })
    public path: string;

    @Column({ name: 'combo_id', select: false })
    public comboId: number;

    @ManyToOne(() => Combo, combo => combo.comboImages)
    @JoinColumn({ name: 'combo_id' })
    public combo: Combo;

    static create(data: Partial<ComboImage>): ComboImage {
        return Object.assign(new ComboImage(), data);
    }
}