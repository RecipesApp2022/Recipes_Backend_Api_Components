import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ReadEmailContactDto {
  @Expose()
  public readonly id: number;

  @Expose()
  public readonly email: string;

  @Expose()
  public readonly content: string;

  @Expose()
  public readonly createdAt: string;
}
