import { EsEntity, EsField } from "../lib/es-mapping-ts";
import { DogEntity } from "./dog.entity";
import { EsNestedField } from "../lib/es-mapping-ts/es-nested-field.decorator";


@EsEntity({
  index: 'user',
  type: 'user'
})
export class UserEntity {

  @EsField({
    type: "text",
  })
  name: string;

  @EsField({
    type: "integer",
  })
  age: number;

  @EsNestedField()
  dog: DogEntity;
  
}