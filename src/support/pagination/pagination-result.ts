import { ClassConstructor, plainToInstance } from "class-transformer";

export class PaginationResult<T> {
  public numberOfPages: number;

  constructor(public results: T[], public total: number, private size: number) {
    this.numberOfPages = Math.ceil(total / size);
  }

  toClass<V>(dtoClass: ClassConstructor<V>): PaginationResult<V> {
    return new PaginationResult(plainToInstance(dtoClass, this.results), this.total, this.size);
  }
}
