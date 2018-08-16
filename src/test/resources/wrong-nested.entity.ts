import { EsEntity, EsField } from '../../lib/es-mapping-ts';
import { NestedEntity } from './nested.entity';

@EsEntity()
export class WrongNestedEntity {

  @EsField({
    type: 'nested'
  })
  nesteds: NestedEntity;
}
