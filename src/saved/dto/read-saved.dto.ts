import { Exclude, Expose } from "class-transformer";
import { SavedType } from "../enum/saved-type.enum";
import { ReadSaveableDto } from "./read-saveable.dto";

@Exclude()
export class ReadSavedDto {
    @Expose()
    public readonly id: number;

    @Expose()
    public readonly type: SavedType;

    @Expose()
    public readonly saveable: ReadSaveableDto;

    @Expose()
    public readonly createdAt: string;
}