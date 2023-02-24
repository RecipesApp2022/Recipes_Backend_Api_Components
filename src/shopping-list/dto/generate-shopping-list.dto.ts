import { Exclude, Expose } from "class-transformer";
import { ShoppingListType } from "../types/shopping-list-type";

@Exclude()
export class GenerateShoppingListDto {
    @Expose()
    public readonly clientId: number;

    @Expose()
    public readonly type: ShoppingListType;
}