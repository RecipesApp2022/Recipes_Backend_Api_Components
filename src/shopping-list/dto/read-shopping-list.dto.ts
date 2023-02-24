import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ReadShoppingListDto {
  @Expose()
  public readonly id: number;

  @Expose()
  public readonly name: string;

  @Expose()
  public readonly path: string;

  @Expose()
  public readonly createdAt: string;
}
