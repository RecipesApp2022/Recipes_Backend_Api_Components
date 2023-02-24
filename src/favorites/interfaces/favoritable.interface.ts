import { ReadFavoritableDto } from "../dto/read-favoritable.dto";

export interface Favoritable {
    toFavoritable(): ReadFavoritableDto;
}