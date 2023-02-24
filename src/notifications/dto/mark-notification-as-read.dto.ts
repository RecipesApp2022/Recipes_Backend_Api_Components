import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
export class MarkNotificationAsReadDto {
    @Expose()
    @Type(() => Number)
    public readonly id: number;

    @Expose()
    public readonly userId: number;
}