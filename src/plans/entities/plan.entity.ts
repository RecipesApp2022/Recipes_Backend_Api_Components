import { uniqBy } from "lodash";
import { Category } from "src/categories/entities/category.entity";
import { Client } from "src/clients/entities/client.entity";
import { Comment } from "src/comments/entities/comment.entity";
import { PlansMigration1653679992221 } from "src/database/migrations/1653679992221-PlansMigration";
import { CategoryPlanMigration1653681256652 } from "src/database/migrations/1653681256652-CategoryPlanMigration";
import { Event } from "src/events/entities/event.entity";
import { ReadFavoritableDto } from "src/favorites/dto/read-favoritable.dto";
import { Favorite } from "src/favorites/entities/favorite.entity";
import { Favoritable } from "src/favorites/interfaces/favoritable.interface";
import { Ingredient } from "src/ingredients/entities/ingredient.entity";
import { PurchasedProduct } from "src/purchased-products/entities/purchased-product.entity";
import { Rating } from "src/ratings/entities/rating.entity";
import { Recipe } from "src/recipes/entities/recipes.entity";
import { Saved } from "src/saved/entities/saved.entity";
import { Seller } from "src/sellers/entities/seller.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PlanDay } from "./plan-day.entity";
import { PlanImage } from "./plan-image.entity";

@Entity({ name: PlansMigration1653679992221.tableName })
export class Plan implements Favoritable {
    @PrimaryGeneratedColumn({ name: 'id' })
    public readonly id: number;

    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'slug' })
    public slug: string;

    @Column({ name: 'price' })
    public price: number;

    @Column({ name: 'description' })
    public description: string;

    @Column({ name: 'number_of_days' })
    public numberOfDays: number;

    @Column({ name: 'rating' })
    public rating: number;
    
    @ManyToMany(() => Category)
    @JoinTable({
        name: CategoryPlanMigration1653681256652.tableName,
        joinColumn: { name: 'plan_id' },
        inverseJoinColumn: { name: 'category_id' },
    })
    public categories: Category[];

    @OneToMany(() => PlanImage, planImage => planImage.plan, { cascade: ['insert', 'update'] })
    public planImages: PlanImage[];

    @OneToMany(() => PlanDay, planDay => planDay.plan, { cascade: ['insert', 'update'] })
    public planDays: PlanDay[];

    @Column({ name: 'seller_id', select: false })
    public sellerId: number;

    @ManyToOne(() => Seller)
    @JoinColumn({ name: 'seller_id' })
    public seller: Seller;

    @Column({ name: 'client_id', select: false })
    public clientId: number;

    @ManyToOne(() => Client)
    @JoinColumn({ name: 'client_id' })
    public client: Client;

    @OneToMany(() => Favorite, favorite => favorite.plan)
    public favorites: Favorite[];

    @OneToMany(() => Saved, saved => saved.plan)
    public saveds: Saved[];

    public saved: Saved;

    @OneToMany(() => Comment, comment => comment.plan)
    public comments: Comment[];

    @OneToMany(() => Event, event => event.plan)
    public events: Event[];

    @OneToMany(() => Rating, rating => rating.plan)
    public ratings: Rating[];

    public clientRating: Rating;

    @OneToMany(() => PurchasedProduct, purchasedProduct => purchasedProduct.plan)
    public purchasedProducts: PurchasedProduct[];

    public purchasedProduct: PurchasedProduct;

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

    get fullPlanDays(): PlanDay[] {
        const baseDays = [...Array(this.numberOfDays).keys()].map(n => PlanDay.create({
            id: null,
            day: n + 1,
        }));

        this.planDays?.forEach(planDay => {
            const index = baseDays.findIndex(baseDay => baseDay.day === planDay.day);

            if (index === -1) {
                return;
            }
            
            baseDays[index] = planDay;
        });

        return baseDays;
    }

    public get images(): PlanImage[] {
        return this.planImages;
    }
    
    public get numberOfIngredients(): number {
        return this.planDays?.reduce((total, planDay) => total + planDay?.numberOfIngredients ?? 0, 0) ?? 0;
    }

    public get numberOfRecipes(): number {
        return this.uniqueRecipes.length;
    }

    public get uniqueRecipes(): Recipe[] {
        const recipes = this.planDays?.reduce((recipes, planDay) => {
            const recipesToAdd = planDay.planDayRecipes?.map(pdr => pdr.recipe).filter(recipe => recipe) ?? [];
            
            return [...recipes, ...recipesToAdd];
        }, []) ?? [];

        return uniqBy(recipes, 'id');
    }

    public get uniqueIngredients(): Ingredient[] {
        const ingredients = this.uniqueRecipes.reduce((ingredients, recipe) => {
            const ingredientsToAdd = recipe.recipeIngredients?.map(ri => ri?.ingredient).filter(ingredient => ingredient) ?? [];
            
            return [...ingredients, ...ingredientsToAdd];
        }, []);

        return uniqBy(ingredients, 'id');
    }

    public get alreadyAcquired(): boolean {
        return !!this.purchasedProduct;
    }

    public toFavoritable(): ReadFavoritableDto {
        return {
            name: this.name,
            slug: this.slug,
            price: this.price,
            sellerName: this.seller?.name,
            sellerLogo: this.seller?.logo,
            imgPath: this.images?.[0].path,
            numberOfIngredients: this.numberOfIngredients,
            numberOfItems: this.numberOfRecipes,
            preparationTime: 0,
            mealPeriodName: null,
        };
    }

    static create(data: Partial<Plan>): Plan {
        return Object.assign(new Plan(), data);
    }
}