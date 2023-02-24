import { Exclude, Expose, Type } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

@Exclude()
export class AnswerCommentDto {
    @Expose()
    @Type(() => Number)
    public readonly id: number;

    @Expose()
    @IsString()
    @IsNotEmpty()
    public readonly answer: string;
}