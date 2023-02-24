import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
export class ReadCategoryDto {
    @Expose()
    public readonly id: number;

    @Expose()
    public readonly name: string;

    @Expose()
    public readonly banner: string;

    @Expose()
    public readonly appLogo: string;

    @Expose()
    public readonly createdAt: string;

    @Expose()
    @Type(() => ReadCategoryDto)
    public readonly parentCategory: ReadCategoryDto;
}