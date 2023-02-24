import { groupBy } from "lodash";
import { PlanDaysMigration1654009361067 } from "src/database/migrations/1654009361067-PlanDaysMigration";
import { MealPeriod } from "src/meal-periods/entities/meal-period.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PlanDayRecipe } from "./plan-day-recipe.entity";
import { Plan } from "./plan.entity";

@Entity({ name: PlanDaysMigration1654009361067.tableName })
export class PlanDay {    
    public static mealPeriods: MealPeriod[] = [];
    
    @PrimaryGeneratedColumn({ name: 'id' })
    public readonly id: number;

    @Column({ name: 'day_number' })
    public day: number;

    @Column({ name: 'plan_id', select: false })
    public planId: number;

    @ManyToOne(() => Plan)
    @JoinColumn({ name: 'plan_id' })
    public plan: Plan;

    @OneToMany(() => PlanDayRecipe, planDayRecipe => planDayRecipe.planDay, { cascade: ['insert', 'update'] })
    public planDayRecipes: PlanDayRecipe[];

    public get mealPeriods(): any {
        const baseMealPeriodsWithRecipes = PlanDay.mealPeriods.map(mealPeriod => ({
            ...mealPeriod,
            recipes: [],
        }));
        
        if (!this.planDayRecipes) {
            return baseMealPeriodsWithRecipes;
        }
        
        const mappedPlanDayRecipes: any = groupBy(this.planDayRecipes, 'mealPeriod.id');

        const mealPeriods: typeof baseMealPeriodsWithRecipes = Object.keys(mappedPlanDayRecipes).map(id => ({
            id: +id,
            name: mappedPlanDayRecipes[id][0].mealPeriod?.name,
            icon: mappedPlanDayRecipes[id][0].mealPeriod?.icon,
            createdAt: mappedPlanDayRecipes[id][0].mealPeriod?.createdAt,
            recipes: mappedPlanDayRecipes[id].map((planDayRecipe: PlanDayRecipe) => planDayRecipe?.recipe)
        }) as any);

        mealPeriods.forEach(mealPeriod => {
            const index = baseMealPeriodsWithRecipes.findIndex(baseMealPeriod => baseMealPeriod.id === mealPeriod.id);

            if (index === -1) {
                return;
            }

            baseMealPeriodsWithRecipes[index] = mealPeriod;
        });

        return baseMealPeriodsWithRecipes;
    }

    public get numberOfIngredients(): number {
        return this.planDayRecipes?.reduce((total, planDayRecipe) => total + planDayRecipe.recipe?.numberOfDinners ?? 0, 0) ?? 0;
    }

    static create(data: Partial<PlanDay>): PlanDay {
        return Object.assign(new PlanDay(), data);
    }
}