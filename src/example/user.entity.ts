import { EsEntity, EsField } from "../lib/es-mapping-ts";
import { Budget } from "./budget.entity";
import { MasterEntity } from "./master.entity";

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

  @EsField({
    type: 'join',
    relations: { "parent" : "child"}
  })
  children: Array<UserEntity>;

  @EsField({
    type: 'object'
  })
  dog: Budget;

  @EsField({
    type: 'nested',
    nestedType : MasterEntity
  })
  master: Array<MasterEntity>;
}