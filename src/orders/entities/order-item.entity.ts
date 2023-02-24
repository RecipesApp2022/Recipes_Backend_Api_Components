import { Combo } from "src/combos/entities/combo.entity";
import { OrderItemsMigration1662498656253 } from "src/database/migrations/1662498656253-OrderItemsMigration";
import { Plan } from "src/plans/entities/plan.entity";
import { Rating } from "src/ratings/entities/rating.entity";
import { Recipe } from "src/recipes/entities/recipes.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProductType } from "../enums/product-type.enum";
import { Order } from "./order.entity";

@Entity({ name: OrderItemsMigration1662498656253.tableName })
export class OrderItem {
    @PrimaryGeneratedColumn({ name: 'id' })
    public readonly id: number;

    @Column({ name: 'quantity' })
    public quantity: number;

    @Column({ name: 'price' })
    public price: number;

    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'slug' })
    public slug: string;

    @Column({ name: 'image' })
    public image: string;

    @Column({ name: 'type' })
    public type: ProductType;

    @Column({ name: 'order_id', select: false })
    public orderId: number;

    @ManyToOne(() => Order)
    @JoinColumn({ name: 'order_id' })
    public order: Order;

    @Column({ name: 'recipe_id' })
    public recipeId: number;
    
    @ManyToOne(() => Recipe)
    @JoinColumn({ name: 'recipe_id' })
    public recipe: Recipe;

    @Column({ name: 'plan_id' })
    public planId: number;
    
    @ManyToOne(() => Plan)
    @JoinColumn({ name: 'plan_id' })
    public plan: Plan;

    @Column({ name: 'combo_id' })
    public comboId: number;
    
    @ManyToOne(() => Combo)
    @JoinColumn({ name: 'combo_id' })
    public combo: Combo;

    public get productId(): number {
        return this.recipeId || this.planId || this.comboId;
    }

    public get rating(): Rating {
        return this.recipe?.clientRating || this.plan?.clientRating || this.combo?.clientRating || null;
    }

    public get total(): number {
        return this.price * this.quantity;
    }
    
    static create(data: Partial<OrderItem>): OrderItem {
        return Object.assign(new OrderItem(), data);
    }

    static createFromProduct(product: Recipe | Plan | Combo): OrderItem {
        const plainData: Partial<OrderItem> = {
            quantity: 1,
            price: product.price,
            name: product.name,
            slug: product.slug,
        };

        if (product instanceof Recipe) {
            Object.assign<Partial<OrderItem>, Partial<OrderItem>>(plainData, {
                recipe: product,
                type: ProductType.RECIPE,
                image: product.recipeImages?.[0]?.path,
            });
        } else if(product instanceof Plan) {
            Object.assign<Partial<OrderItem>, Partial<OrderItem>>(plainData, {
                plan: product,
                type: ProductType.PLAN,
                image: product.planImages?.[0]?.path,
            });
        } else if(product instanceof Combo) {
            Object.assign<Partial<OrderItem>, Partial<OrderItem>>(plainData, {
                combo: product,
                type: ProductType.COMBO,
                image: product.comboImages?.[0]?.path,
            });
        }
        
        return OrderItem.create(plainData);
    }
}