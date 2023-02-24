import { Exclude, Expose } from "class-transformer";

@Exclude()
export class ReadMeasurementUnitDto {
    @Expose()
    public readonly id: number;

    @Expose()
    public readonly name: string;

    @Expose()
    public readonly abbreviation: string;

    @Expose()
    public readonly createdAt: string;
}