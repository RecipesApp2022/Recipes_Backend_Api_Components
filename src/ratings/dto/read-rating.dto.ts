import { Exclude, Expose, plainToClass, Transform, Type } from "class-transformer";
import { ReadClientDto } from "src/clients/dto/read-client.dto";
import { ReadComboDto } from "src/combos/dto/read-combo.dto";
import { ReadPlanDto } from "src/plans/dto/read-plan.dto";
import { ReadRecipeDto } from "src/recipes/dto/read-recipe.dto";
import { User } from "src/users/entities/user.entity";
import { RatingItemType } from "../types/rating-item-type.enum";

@Exclude()
export class ReadRatingDto {
    @Expose()
    public readonly id: number;

    @Expose()
    public readonly value: number;

    @Expose()
    public readonly comment: string;

    @Expose()
    public readonly isEdited: boolean;

    @Expose()
    public readonly itemId: number;

    @Expose()
    public readonly itemType: RatingItemType;

    @Expose()
    public readonly createdAt: string;

    @Expose()
    @Transform(({obj}) => obj.client ? plainToClass(ReadClientDto, User.create({client: obj.client})) : null)
    public readonly client: ReadClientDto;

    @Expose()
    @Type(() => ReadRecipeDto)
    public readonly recipe: ReadRecipeDto;

    @Expose()
    @Type(() => ReadPlanDto)
    public readonly plan: ReadPlanDto;

    @Expose()
    @Type(() => ReadComboDto)
    public readonly combo: ReadComboDto;
}