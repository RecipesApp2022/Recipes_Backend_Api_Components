import { Exclude, Expose, plainToClass, Transform, Type } from "class-transformer";
import { ReadCategoryDto } from "src/categories/dto/read-category.dto";
import { ReadComboPurposeDto } from "src/combo-purposes/dto/read-combo-purpose.dto";
import { ReadCommentDto } from "src/comments/dto/read-comment.dto";
import { ReadPlanDto } from "src/plans/dto/read-plan.dto";
import { ReadRecipeDto } from "src/recipes/dto/read-recipe.dto";
import { ReadSellerDto } from "src/sellers/dto/read-seller.dto";
import { User } from "src/users/entities/user.entity";
import { ComboImage } from "../entities/combo-image.entity";

@Exclude()
export class ReadComboDto {
    @Expose()
    public readonly id: number;

    @Expose()
    public readonly name: string;

    @Expose()
    public readonly slug: string;

    @Expose()
    @Type(() => Number)
    public readonly price: number;

    @Expose()
    public readonly description: string;

    @Expose()
    public readonly rating: number;

    @Expose()
    public readonly createdAt: string;

    @Expose()
    public readonly alreadyAcquired: boolean;

    @Expose()
    @Type(() => ReadComboPurposeDto)
    public readonly comboPurpose: ReadComboPurposeDto;

    @Expose()
    public readonly images: ComboImage[];

    @Expose()
    @Transform(({value}) => !!value)
    public saved: boolean;

    @Expose()
    @Type(() => ReadCategoryDto)
    public readonly categories: ReadCategoryDto[];

    @Expose()
    @Type(() => ReadRecipeDto)
    public readonly recipes: ReadRecipeDto[];

    @Expose()
    @Type(() => ReadPlanDto)
    public readonly plans: ReadPlanDto[];

    @Expose()
    @Transform(({obj}) => obj.seller ? plainToClass(ReadSellerDto, User.create({seller: obj.seller})) : null)
    public readonly seller: ReadSellerDto;

    @Expose()
    public readonly numberOfIngredients: number;

    @Expose()
    public readonly numberOfItems: number;

    @Expose()
    @Type(() => ReadCommentDto)
    public readonly comments: ReadCommentDto[];
}