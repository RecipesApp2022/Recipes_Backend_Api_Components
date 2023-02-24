import { Category } from "src/categories/entities/category.entity";
import { ComboPurpose } from "src/combo-purposes/entities/combo-purpose.entity";
import { Comment } from "src/comments/entities/comment.entity";
import { CombosMigration1654123467552 } from "src/database/migrations/1654123467552-CombosMigration";
import { CategoryComboMigration1654183900547 } from "src/database/migrations/1654183900547-CategoryComboMigration";
import { ComboRecipeMigration1654185047344 } from "src/database/migrations/1654185047344-ComboRecipeMigration";
import { ComboPlanMigration1654185385279 } from "src/database/migrations/1654185385279-ComboPlanMigration";
import { ReadFavoritableDto } from "src/favorites/dto/read-favoritable.dto";
import { Favorite } from "src/favorites/entities/favorite.entity";
import { Favoritable } from "src/favorites/interfaces/favoritable.interface";
import { Plan } from "src/plans/entities/plan.entity";
import { PurchasedProduct } from "src/purchased-products/entities/purchased-product.entity";
import { Rating } from "src/ratings/entities/rating.entity";
import { Recipe } from "src/recipes/entities/recipes.entity";
import { Saved } from "src/saved/entities/saved.entity";
import { Seller } from "src/sellers/entities/seller.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ComboImage } from "./combo-image.entity";

@Entity({ name: CombosMigration1654123467552.tableName })
export class Combo implements Favoritable {
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

    @Column({ name: 'rating' })
    public rating: number;

    @Column({ name: 'combo_purpose_id', select: false })
    public comboPurposeId: number;

    @ManyToOne(() => ComboPurpose)
    @JoinColumn({ name: 'combo_purpose_id' })
    public comboPurpose: ComboPurpose;

    @Column({ name: 'seller_id', select: false })
    public sellerId: number;

    @ManyToOne(() => Seller)
    @JoinColumn({ name: 'seller_id' })
    public seller: Seller;

    @OneToMany(() => ComboImage, comboImage => comboImage.combo, { cascade: ['insert', 'update'] })
    public comboImages: ComboImage[];

    @ManyToMany(() => Category)
    @JoinTable({
        name: CategoryComboMigration1654183900547.tableName,
        joinColumn: { name: 'combo_id' },
        inverseJoinColumn: { name: 'category_id' },
    })
    public categories: Category[];

    @ManyToMany(() => Recipe)
    @JoinTable({
        name: ComboRecipeMigration1654185047344.tableName,
        joinColumn: { name: 'combo_id' },
        inverseJoinColumn: { name: 'recipe_id' },
    })
    public recipes: Recipe[];

    @ManyToMany(() => Plan)
    @JoinTable({
        name: ComboPlanMigration1654185385279.tableName,
        joinColumn: { name: 'combo_id' },
        inverseJoinColumn: { name: 'plan_id' },
    })
    public plans: Plan[];

    @OneToMany(() => Favorite, favorite => favorite.combo)
    public favorites: Favorite[];

    @OneToMany(() => Saved, saved => saved.combo)
    public saveds: Saved[];

    public saved: Saved;

    @OneToMany(() => Comment, comment => comment.combo)
    public comments: Comment[];

    @OneToMany(() => Rating, rating => rating.combo)
    public ratings: Rating[];

    public clientRating: Rating;

    @OneToMany(() => PurchasedProduct, purchasedProduct => purchasedProduct.combo)
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

    public get images(): ComboImage[] {
        return this.comboImages;
    }

    public get numberOfIngredients(): number {
        const recipesNumberOfIngredients = this.recipes?.reduce((total, recipe) => total + recipe.numberOfIngredients, 0) ?? 0;
        const plansNumberOfIngredients = this.plans?.reduce((total, plan) => total + plan.numberOfIngredients, 0) ?? 0;

        return recipesNumberOfIngredients + plansNumberOfIngredients;
    }

    public get numberOfItems(): number {
        const numberOfRecipes = this.recipes?.length ?? 0;
        const numberOfPlans = this.plans?.length ?? 0;

        return numberOfRecipes + numberOfPlans;
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
            numberOfItems: this.numberOfItems,
            preparationTime: 0,
            mealPeriodName: null,
        };
    }

    static create(data: Partial<Combo>): Combo {
        return Object.assign(new Combo(), data);
    }
}