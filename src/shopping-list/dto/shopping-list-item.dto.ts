import { Ingredient } from "src/ingredients/entities/ingredient.entity";
import { MeasurementUnit } from "src/measurement-units/entities/measurement-unit.entity";

export type ShoppingListItem = Ingredient&{ measurementUnits: (MeasurementUnit&{quantity: number})[] }