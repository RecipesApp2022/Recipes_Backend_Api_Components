import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
export class DeleteComboDto {
    @Expose()
    @Type(() => Number)
    public readonly id: number;

    @Expose()
    public readonly sellerId: number;
}