import { Category } from "src/categories/entities/category.entity";
import { Comment } from "src/comments/entities/comment.entity";
import { RecipesMigration1652967102617 } from "src/database/migrations/1652967102617-RecipesMigration";
import { CategoryRecipeMigration1652967914961 } from "src/database/migrations/1652967914961-CategoryRecipeMigration";
import { MealPeriodRecipeMigration1652969524137 } from "src/database/migrations/1652969524137-MealPeriodRecipeMigration";
import { Event } from "src/events/entities/event.entity";
import { ReadFavoritableDto } from "src/favorites/dto/read-favoritable.dto";
import { Favorite } from "src/favorites/entities/favorite.entity";
import { Favoritable } from "src/favorites/interfaces/favoritable.interface";
import { MealPeriod } from "src/meal-periods/entities/meal-period.entity";
import { PurchasedProduct } from "src/purchased-products/entities/purchased-product.entity";
import { Rating } from "src/ratings/entities/rating.entity";
import { RecipeDifficulty } from "src/recipe-difficulties/entities/recipe-difficulty.entity";
import { Saved } from "src/saved/entities/saved.entity";
import { Seller } from "src/sellers/entities/seller.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RecipeImage } from "./recipe-image.entity";
import { RecipeIngredient } from "./recipe-ingredient.entity";
import { RecipeStep } from "./recipe-step.entity";
import { RecipeVideo } from "./recipe-video.entity";

@Entity({ name: RecipesMigration1652967102617.tableName })
export class Recipe implements Favoritable {
    @PrimaryGeneratedColumn({ name: 'id' })
    public readonly id: number;

    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'slug' })
    public slug: string;

    @Column({ name: 'preparation_time' })
    public preparationTime: number;

    @Column({ name: 'description' })
    public description: string;

    @Column({ name: 'short_description' })
    public shortDescription: string;

    @Column({ name: 'is_premium' })
    public isPremium: boolean;

    @Column({ name: 'price' })
    public price: number;

    @Column({ name: 'number_of_dinners' })
    public numberOfDinners: number;

    @Column({ name: 'rating' })
    public rating: number;

    @Column({ name: 'seller_id', select: false })
    public sellerId: number;

    @ManyToOne(() => Seller)
    @JoinColumn({ name: 'seller_id' })
    public seller: Seller;

    @Column({ name: 'recipe_difficulty_id', select: false })
    public recipeDifficultyId: number;

    @ManyToOne(() => RecipeDifficulty)
    @JoinColumn({ name: 'recipe_difficulty_id' })
    public recipeDifficulty: RecipeDifficulty;

    @ManyToMany(() => Category)
    @JoinTable({
        name: CategoryRecipeMigration1652967914961.tableName,
        joinColumn: { name: 'recipe_id' },
        inverseJoinColumn: { name: 'category_id' },
    })
    public categories: Category[];

    @ManyToMany(() => MealPeriod)
    @JoinTable({
        name: MealPeriodRecipeMigration1652969524137.tableName,
        joinColumn: { name: 'recipe_id' },
        inverseJoinColumn: { name: 'meal_period_id' },
    })
    public mealPeriods: MealPeriod[];

    @OneToMany(() => RecipeImage, recipeImage => recipeImage.recipe, { cascade: ['insert', 'update'] })
    public recipeImages: RecipeImage[];

    @OneToMany(() => RecipeVideo, recipeVideo => recipeVideo.recipe, { cascade: ['insert', 'update'] })
    public recipeVideos: RecipeVideo[];

    @OneToMany(() => RecipeIngredient, recipeIngredient => recipeIngredient.recipe, { cascade: ['insert', 'update'] })
    public recipeIngredients: RecipeIngredient[];

    @OneToMany(() => RecipeStep, recipeStep => recipeStep.recipe, { cascade: ['insert', 'update'] })
    public recipeSteps: RecipeStep[];

    @OneToMany(() => Favorite, favorite => favorite.recipe)
    public favorites: Favorite[];

    @OneToMany(() => Saved, saved => saved.recipe)
    public saveds: Saved[];

    public saved: Saved;

    @OneToMany(() => Comment, comment => comment.recipe)
    public comments: Comment[];

    @OneToMany(() => Event, event => event.recipe)
    public events: Event[];

    @OneToMany(() => Rating, rating => rating.recipe)
    public ratings: Rating[];

    public clientRating: Rating;

    @OneToMany(() => PurchasedProduct, purchasedProduct => purchasedProduct.recipe)
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

    public get images(): RecipeImage[] {
        return this.recipeImages;
    }

    public get numberOfIngredients(): number {
        return this.recipeIngredients?.length ?? 0;
    }

    public get alreadyAcquired(): boolean {
        return !!this.purchasedProduct;
    }

    public toFavoritable(): ReadFavoritableDto {
        return {
            name: this.name,
            slug: this.slug,
            price: this.price,
            sellerName: this.seller?.name ?? null,
            sellerLogo: this.seller?.logo ?? null,
            imgPath: this.images?.[0].path ?? null,
            numberOfIngredients: this.numberOfIngredients,
            numberOfItems: 1,
            preparationTime: this.preparationTime,
            mealPeriodName: this.mealPeriods?.map(mp => mp.name).join(' - ') ?? null,
        };
    }

    static create(data: Partial<Recipe>): Recipe {
        return Object.assign(new Recipe(), data);
    }
}