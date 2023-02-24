import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
export class DeleteEventDto {
    @Expose()
    @Type(() => Number)
    public readonly id: number;

    @Expose()
    public readonly clientId: number;
}