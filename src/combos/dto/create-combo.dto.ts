import { Exclude, Expose, Transform, Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsString, Min } from "class-validator";
import { Category } from "src/categories/entities/category.entity";
import { ComboPurpose } from "src/combo-purposes/entities/combo-purpose.entity";
import { Plan } from "src/plans/entities/plan.entity";
import { Recipe } from "src/recipes/entities/recipes.entity";
import { Exists } from "src/validation/exists.constrain";

@Exclude()
export class CreateComboDto {
    @Expose()
    public readonly sellerId: number;
    
    @Expose()
    @IsString()
    @IsNotEmpty()
    public readonly name: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    public readonly slug: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    public readonly description: string;

    @Expose()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    public readonly price: number;

    @Expose()
    @Exists(ComboPurpose)
    public readonly comboPurposeId: number;
    
    @Expose()
    @Transform(({value}) => value ?? [])
    @IsArray()
    @Exists(Category, 'id', null, { each: true })
    public readonly categoryIds: number[];

    @Expose()
    @Transform(({value}) => value ?? [])
    @IsArray()
    @Exists(Recipe, 'id', (id, { sellerId }: CreateComboDto) => ({
        join: { alias: 'recipe' },
        where: qb => {
            qb.where({ id }).andWhere('recipe.sellerId = :sellerId', { sellerId });
        }
    }), { each: true })
    public readonly recipeIds: number[];

    // Validar que pertenezca al vendedor
    @Expose()
    @Transform(({value}) => value ?? [])
    @IsArray()
    @Exists(Plan, 'id', null, { each: true })
    public readonly planIds: number[];
}