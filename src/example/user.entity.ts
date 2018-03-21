import { EsEntity, EsField, EsNestedField } from "../lib/es-mapping-ts";
import { DogEntity } from "./dog.entity";

@EsEntity({
  index: 'user',
  type: 'user'
})
export class UserEntity {

  @EsField({
    type: "text",
    analyzer : 'whitespace'
  })
  name: string;

  @EsField({
    type: "integer",
  })
  age: number;

  @EsNestedField()
  dog: DogEntity;
}