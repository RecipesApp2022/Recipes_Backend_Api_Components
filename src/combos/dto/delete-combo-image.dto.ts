import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
export class DeleteComboImageDto {
    @Expose()
    @Type(() => Number)
    readonly id: number;

    @Expose()
    readonly sellerId: number;

    @Expose()
    @Type(() => Number)
    readonly imageId: number;
}