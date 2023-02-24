import { Exclude, Expose, Transform, Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsString, MaxLength, Min, ValidateIf, ValidateNested } from "class-validator";
import { Category } from "src/categories/entities/category.entity";
import { Role } from "src/users/enums/role.enum";
import { Exists } from "src/validation/exists.constrain";
import { CreatePlanDayDto } from "./create-plan-day.dto";

@Exclude()
export class CreatePlanDto {
    @Expose()
    public readonly sellerId: number;

    @Expose()
    public readonly clientId: number;

    @Expose()
    public readonly role: Role;
    
    @Expose()
    @IsString()
    @IsNotEmpty()
    public readonly name: string;

    @Expose()
    @MaxLength(255)
    public readonly slug: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    public readonly description: string;

    @Expose()
    @ValidateIf((obj) => obj.role === Role.SELLER)
    @Type(() => Number)
    @IsNumber()
    public readonly price: number;

    @Expose()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    public readonly numberOfDays: number;

    @Expose()
    @Transform(({value}) => value ?? [])
    @IsArray()
    @Exists(Category, 'id', null, { each: true })
    public readonly categoryIds: number[];

    @Expose()
    @Type(() => CreatePlanDayDto)
    @ValidateNested({ each: true })
    @IsArray()
    @ArrayMinSize(1)
    public readonly planDays: CreatePlanDayDto[];
}