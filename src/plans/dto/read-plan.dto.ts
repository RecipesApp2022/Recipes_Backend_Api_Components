import { Exclude, Expose, plainToClass, Transform, Type } from "class-transformer";
import { ReadCategoryDto } from "src/categories/dto/read-category.dto";
import { ReadCommentDto } from "src/comments/dto/read-comment.dto";
import { ReadIngredientDto } from "src/ingredients/dto/read-ingredient.dto";
import { ReadRatingDto } from "src/ratings/dto/read-rating.dto";
import { ReadRecipeDto } from "src/recipes/dto/read-recipe.dto";
import { ReadSellerDto } from "src/sellers/dto/read-seller.dto";
import { User } from "src/users/entities/user.entity";
import { PlanImage } from "../entities/plan-image.entity";
import { ReadPlanDayDto } from "./read-plan-day.dto";

@Exclude()
export class ReadPlanDto {
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
    public readonly numberOfDays: number;

    @Expose()
    public readonly rating: number;

    @Expose()
    @Type(() => ReadCategoryDto)
    public readonly categories: ReadCategoryDto[];

    @Expose()
    public readonly images: PlanImage[];
    
    @Expose()
    public readonly createdAt: string;

    @Expose()
    public readonly alreadyAcquired: boolean;

    @Expose()
    @Transform(({value}) => !!value)
    public readonly saved: boolean;

    @Expose()
    @Type(() => ReadPlanDayDto)
    public readonly planDays: ReadPlanDayDto[];

    @Expose()
    @Type(() => ReadPlanDayDto)
    public readonly fullPlanDays: ReadPlanDayDto[];

    @Expose()
    @Transform(({obj}) => obj.seller ? plainToClass(ReadSellerDto, User.create({seller: obj.seller})) : null)
    public readonly seller: ReadSellerDto;

    @Expose()
    @Type(() => ReadRecipeDto)
    public readonly uniqueRecipes: ReadRecipeDto[];

    @Expose()
    @Type(() => ReadIngredientDto)
    public readonly uniqueIngredients: ReadIngredientDto[];

    @Expose()
    @Type(() => ReadCommentDto)
    public readonly comments: ReadCommentDto[];
    
    @Expose()
    @Type(() => ReadRatingDto)
    public readonly clientRating: ReadRatingDto;
}