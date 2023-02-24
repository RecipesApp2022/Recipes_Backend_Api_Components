import { Exclude, Expose, plainToClass, Transform, Type } from "class-transformer";
import { ReadCategoryDto } from "src/categories/dto/read-category.dto";
import { ReadCommentDto } from "src/comments/dto/read-comment.dto";
import { ReadMealPeriodDto } from "src/meal-periods/dto/read-meal-period.dto";
import { ReadRatingDto } from "src/ratings/dto/read-rating.dto";
import { ReadRecipeDifficultyDto } from "src/recipe-difficulties/dto/read-recipe-difficulty.dto";
import { ReadSellerDto } from "src/sellers/dto/read-seller.dto";
import { User } from "src/users/entities/user.entity";
import { RecipeImage } from "../entities/recipe-image.entity";
import { RecipeStep } from "../entities/recipe-step.entity";
import { RecipeVideo } from "../entities/recipe-video.entity";
import { Recipe } from "../entities/recipes.entity";
import { ReadRecipeIngredientDto } from "./read-recipe-ingredient.dto";

@Exclude()
export class ReadRecipeDto {
    @Expose()
    public readonly id: number;
    
    @Expose()
    public readonly name: string;
    
    @Expose()
    public readonly slug: string;
    
    @Expose()
    public readonly preparationTime: number;
    
    @Expose()
    public readonly description: string;
    
    @Expose()
    public readonly shortDescription: string;
    
    @Expose()
    public readonly isPremium: boolean;
    
    @Expose()
    @Type(() => Number)
    public readonly price: number;
    
    @Expose()
    public readonly numberOfDinners: number;

    @Expose()
    public readonly rating: number;

    @Expose()
    public readonly createdAt: string;

    @Expose()
    public readonly alreadyAcquired: boolean;

    @Expose()
    @Type(() => ReadRatingDto)
    public readonly clientRating: ReadRatingDto;

    @Expose()
    @Transform(({value}) => !!value)
    public readonly saved: boolean;
    
    @Expose()
    @Transform(({obj}) => obj.seller ? plainToClass(ReadSellerDto, User.create({seller: obj.seller})) : null)
    public readonly seller: ReadSellerDto;

    @Expose()
    @Type(() => ReadRecipeDifficultyDto)
    public readonly recipeDifficulty: ReadRecipeDifficultyDto;

    @Expose()
    @Type(() => ReadCategoryDto)
    public readonly categories: ReadCategoryDto[];

    @Expose()
    @Type(() => ReadMealPeriodDto)
    public readonly mealPeriods: ReadMealPeriodDto[];

    @Expose()
    public readonly images: RecipeImage[];

    @Expose()
    public readonly recipeVideos: RecipeVideo[];

    @Expose()
    @Type(() => ReadRecipeIngredientDto)
    @Transform(({obj, value}: { obj: Recipe, value: ReadRecipeIngredientDto[] }) => {
        if (obj.isPremium) {
            return value?.filter(recipeIngredient => !recipeIngredient.onlyPremium) ?? [];
        }

        return value;
    })
    public readonly recipeIngredients: ReadRecipeIngredientDto[];

    @Expose()
    @Transform(({obj}) => obj.isPremium ? [] : obj.recipeSteps)
    public readonly recipeSteps: RecipeStep[];

    @Expose()
    @Type(() => ReadCommentDto)
    public readonly comments: ReadCommentDto[];
}