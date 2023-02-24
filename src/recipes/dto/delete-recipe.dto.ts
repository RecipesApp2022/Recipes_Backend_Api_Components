import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
export class DeleteRecipeDto {
    @Expose()
    @Type(() => Number)
    public readonly id: number;

    @Expose()
    public readonly role: string;

    @Expose()
    @Type(() => Number)
    public readonly sellerId: number;
}