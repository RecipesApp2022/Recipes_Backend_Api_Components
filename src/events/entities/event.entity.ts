import { Client } from "src/clients/entities/client.entity";
import { EventsMigration1660858260323 } from "src/database/migrations/1660858260323-EventsMigration";
import { Plan } from "src/plans/entities/plan.entity";
import { Recipe } from "src/recipes/entities/recipes.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: EventsMigration1660858260323.tableName })
export class Event {
    @PrimaryGeneratedColumn({ name: 'id' })
    public readonly id: number;

    @Column({ name: 'start' })
    public start: Date;

    @Column({ name: 'end' })
    public end: Date;

    @Column({ name: 'client_id', select: false })
    public clientId: number;

    @ManyToOne(() => Client)
    @JoinColumn({ name: 'client_id' })
    public client: Client;

    @Column({ name: 'recipe_id', select: false })
    public recipeId: number;

    @ManyToOne(() => Recipe)
    @JoinColumn({ name: 'recipe_id' })
    public recipe: Recipe;

    @Column({ name: 'plan_id', select: false })
    public planId: number;

    @ManyToOne(() => Plan)
    @JoinColumn({ name: 'plan_id' })
    public plan: Plan;
    
    @CreateDateColumn({
        name: 'created_at',
    })
    public createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        select: false,
    })
    public updatedAt: Date;

    get title(): string {
        if (this.recipe) {
            return this.recipe.name;
        }

        if (!this.plan) {
            return 'Unknwon';
        }

        return this.plan.name;
    }

    static create(data: Partial<Event>): Event {
        return Object.assign(new Event(), data);
    }
}
