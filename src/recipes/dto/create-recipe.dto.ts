import { Exclude, Expose, Transform, Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsBoolean, IsNotEmpty, IsNumber, IsPositive, MaxLength, Min, ValidateIf, ValidateNested } from "class-validator";
import { Category } from "src/categories/entities/category.entity";
import { MealPeriod } from "src/meal-periods/entities/meal-period.entity";
import { RecipeDifficulty } from "src/recipe-difficulties/entities/recipe-difficulty.entity";
import { Seller } from "src/sellers/entities/seller.entity";
import booleanTransformer from "src/support/boolean-transformer";
import { Role } from "src/users/enums/role.enum";
import { Exists } from "src/validation/exists.constrain";
import { CreateRecipeIngridientDto } from "./create-recipe-ingredient.dto";
import { CreateRecipeStepDto } from "./create-recipe-step.dto";
import { CreateRecipeVideoDto } from "./create-recipe-video.dto";

@Exclude()
export class CreateRecipeDto {
    @Expose()
    public readonly role: Role;
    
    @Expose()
    @Transform(({obj}) => obj.role === Role.ADMIN ? obj.chefId : obj.sellerId)
    public readonly sellerId: number;

    @Expose()
    @Type(() => Number)
    @ValidateIf((obj) => obj.role === Role.ADMIN)
    @Exists(Seller)
    public readonly chefId: number;
    
    @Expose()
    @IsNotEmpty()
    @MaxLength(255)
    public readonly name: string;

    @Expose()
    @MaxLength(255)
    readonly slug: string;

    @Expose()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    public readonly preparationTime: number;

    @Expose()
    @IsNotEmpty()
    public readonly description: string;

    @Expose()
    @IsNotEmpty()
    public readonly shortDescription: string;

    @Expose()
    @Transform(booleanTransformer)
    @IsBoolean()
    public readonly isPremium: boolean;

    @Expose()
    @Type(() => Number)
    @ValidateIf((obj) => obj.isPremium)
    @IsNumber()
    @IsPositive()
    public readonly price: number;

    @Expose()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    public readonly numberOfDinners: number;

    @Expose()
    @Exists(RecipeDifficulty)
    public readonly recipeDifficultyId: number;

    @Expose()
    @Transform(({value}) => value ?? [])
    @IsArray()
    @Exists(Category, 'id', null, { each: true })
    public readonly categoryIds: number[];

    @Expose()
    @IsArray()
    @ArrayMinSize(1)
    @Exists(MealPeriod, 'id', null, { each: true })
    public readonly mealPeriodIds: number[];

    @Expose()
    @Transform(({value}) => value || [])
    @Type(() => CreateRecipeVideoDto)
    @ValidateNested({ each: true })
    @IsArray()
    public readonly recipeVideos: CreateRecipeVideoDto[];

    @Expose()
    @Type(() => CreateRecipeIngridientDto)
    @ValidateNested({ each: true })
    @IsArray()
    @ArrayMinSize(1)
    public readonly recipeIngredients: CreateRecipeIngridientDto[];

    @Expose()
    @Type(() => CreateRecipeStepDto)
    @ValidateNested({ each: true })
    @IsArray()
    @ArrayMinSize(1)
    public readonly recipeSteps: CreateRecipeStepDto[];
}