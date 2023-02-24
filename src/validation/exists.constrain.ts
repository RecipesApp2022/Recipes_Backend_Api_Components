import { Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { Recipe } from "src/recipes/entities/recipes.entity";
import { EntityManager, FindManyOptions, ObjectType } from "typeorm";

type FindOptionsFactory = (value: any, object: Object) => FindManyOptions;

interface ExistsValidationArguments<T> extends ValidationArguments {
  constraints: [ObjectType<T> | ObjectTypeFactory<T>, string?, FindOptionsFactory?];
}

export class ObjectTypeFactory<T> {
  constructor(public readonly resolveEntity: (value: any, obj: Object) => ObjectType<T>) {}
}

@ValidatorConstraint({
  name: 'exists',
  async: true,
})
@Injectable()
export class ExistsConstrain implements ValidatorConstraintInterface {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager
  ) {}

  async validate<T>(value: any, { constraints, object }: ExistsValidationArguments<T>): Promise<boolean> {
    const [entityType, entityPropertyName = 'id', findConditionsFactory] = constraints;

    const findConditions = typeof findConditionsFactory === 'function'
      ? findConditionsFactory(value, object)
      : { [entityPropertyName]: value };

    const finalEntityType = entityType instanceof ObjectTypeFactory
      ? entityType.resolveEntity(value, object)
      : entityType;

    if (finalEntityType === null) {
      return false;
    }
      
    const count = await this.entityManager
      .getRepository(finalEntityType)
      .count(findConditions);

    return count > 0;
  }

  defaultMessage({ property }: ValidationArguments): string {
    return `${property} is invalid`;
  }
}

export const Exists = <T>(entityType: ObjectType<T> | ObjectTypeFactory<T>, entityPropertyName?: string, findConditionsFactory?: FindOptionsFactory, validationOptions?: ValidationOptions) => {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [entityType, entityPropertyName, findConditionsFactory],
      validator: ExistsConstrain,
    });
  };
}
