import { EsEntity, EsField } from "../lib/es-mapping-ts";

@EsEntity()
export class Budget {

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
  montant: number;

  @EsField({
    type: "raw"
  })
  master: Array<Budget>

}