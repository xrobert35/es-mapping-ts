import { EsEntity, EsField } from '../../lib/es-mapping-ts';

@EsEntity({
  index: 'nested',
})
export class NestedEntity {

  @EsField({
    type: 'text',
  })
  name: string;

  @EsField({
    type: 'integer',
  })
  montant: number;
}
