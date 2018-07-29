import { EsEntity, EsField } from "../lib/es-mapping-ts";

@EsEntity({
  index: 'master',
  type: 'master'
})
export class MasterEntity {

  @EsField({
    type: "text",
    fields: {
      raw: {
        type: "keyword"
      }
    }
  })
  name: string;

  @EsField({
    type: "integer"
  })
  age: number;

  @EsField({
    type: 'join',
    relations: { "master": "submaster" }
  })
  master: Array<MasterEntity>

}