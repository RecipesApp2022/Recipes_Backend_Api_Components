import { OmitType } from "@nestjs/mapped-types";
import { ReadFavoritableDto } from "src/favorites/dto/read-favoritable.dto";

export class ReadSaveableDto extends OmitType(ReadFavoritableDto, [] as const)  {}