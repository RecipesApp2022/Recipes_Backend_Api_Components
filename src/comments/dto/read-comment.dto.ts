import { Exclude, Expose, plainToClass, Transform } from "class-transformer";
import { ReadComboDto } from "src/combos/dto/read-combo.dto";
import { ReadPlanDto } from "src/plans/dto/read-plan.dto";
import { ReadRecipeDto } from "src/recipes/dto/read-recipe.dto";
import { Comment } from "../entities/comment.entity";

@Exclude()
export class ReadCommentDto {
    @Expose()
    public readonly id: number;

    @Expose()
    public readonly comment: string;

    @Expose()
    public readonly answer: string;

    @Expose()
    @Transform(({obj}: {obj: Comment}) => {
        if (obj.client) {
            return obj.client.name;
        }

        return null;
    })
    public readonly name: string;

    @Expose()
    @Transform(({obj}: {obj: Comment}) => {
        if (obj.client) {
            return obj.client.imgPath;
        }

        return null;
    })
    public readonly imgPath: string;

    @Expose()
    public readonly createdAt: string;

    @Expose()
    public readonly answeredAt: string;

    @Expose()
    @Transform(({obj}) => {
        let dto = null;

        if (obj.recipe) {
            dto = plainToClass(ReadRecipeDto, obj.recipe);
        } else if (obj.plan) {
            dto = plainToClass(ReadPlanDto, obj.plan);
        } else if (obj.combo) {
            dto = plainToClass(ReadComboDto, obj.combo);
        }

        return dto;
    })
    public readonly commentable: ReadRecipeDto|ReadPlanDto|ReadComboDto;

    @Expose()
    @Transform(({obj}) => {
        let dto = null;

        if (obj.recipe) {
            dto = 'recipe';
        } else if (obj.plan) {
            dto = 'plan';
        } else if (obj.combo) {
            dto = 'combo';
        }

        return dto;
    })
    public readonly commentableType: 'recipe'|'plan'|'combo';
}