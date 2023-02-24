import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'categories' })
export class Category {
    @PrimaryGeneratedColumn({ name: 'id' })
    public readonly id: number;

    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'banner' })
    public banner: string;

    @Column({ name: 'app_logo' })
    public appLogo: string;

    @Column({ name: 'parent_id', select: false })
    public parentId: number;

    @ManyToOne(() => Category)
    @JoinColumn({ name: 'parent_id' })
    public parentCategory: Category;

    @CreateDateColumn({ name: 'created_at' })
    public createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', select: false })
    public updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', select: false })
    public deleteAt: Date;

    static create(data: Partial<Category>): Category {
        return Object.assign(new Category(), data);
    }
}