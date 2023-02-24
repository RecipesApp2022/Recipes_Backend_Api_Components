import { Exclude, Expose } from "class-transformer";

@Exclude()
export class ReadRecipeDifficultyDto {
    @Expose()
    readonly id: number;

    @Expose()
    readonly name: string;

    @Expose()
    readonly value: number;

    @Expose()
    readonly createdAt: string;
}