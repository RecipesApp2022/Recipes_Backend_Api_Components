import { PlanImagesMigration1653680821676 } from "src/database/migrations/1653680821676-PlanImagesMigration";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Plan } from "./plan.entity";

@Entity({ name: PlanImagesMigration1653680821676.tableName })
export class PlanImage {
    @PrimaryGeneratedColumn({ name: 'id' })
    public readonly id: number;

    @Column({ name: 'path' })
    public path: string;

    @Column({ name: 'plan_id', select: false })
    public planId: number;

    @ManyToOne(() => Plan, plan => plan.planImages)
    @JoinColumn({ name: 'plan_id' })
    public plan: Plan;

    static create(data: Partial<PlanImage>): PlanImage {
        return Object.assign(new PlanImage(), data);
    }
}