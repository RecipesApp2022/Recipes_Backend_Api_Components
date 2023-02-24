import { Exclude, Expose } from "class-transformer";

@Exclude()
export class ReadIngredientTypeDto {
    @Expose()
    readonly id: number;

    @Expose()
    readonly name: string;

    @Expose()
    readonly createdAt: string;
}