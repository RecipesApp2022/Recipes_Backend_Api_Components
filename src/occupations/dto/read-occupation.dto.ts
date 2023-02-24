import { Exclude, Expose } from "class-transformer";

@Exclude()
export class ReadOccupationDto {
    @Expose()
    readonly id: number;

    @Expose()
    readonly name: string;

    @Expose()
    readonly createdAt: string;
}