import { EsEntity, EsField } from "../lib/es-mapping-ts";


@EsEntity({
  index: 'dog',
  type: 'dog'
})
export class DogEntity {

  @EsField({
    type: "text",
    fields : {
      raw: {
          type:  "keyword"
      }
    }
  })
  name: string;

  @EsField({
    type: "integer"
  })
  age: number;

}
