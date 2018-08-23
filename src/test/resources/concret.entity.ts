import { EsEntity, EsField } from '../../lib/es-mapping-ts';
import { AbstractEntity } from './abstract.entity';

@EsEntity({
  index: 'concret',
  type: 'typeConcret'
})
export class ConcretEntity extends AbstractEntity {

  @EsField({
    type: 'text'
  })
  concretName?: string;


  @EsField({
    type: 'text',
    null_value : 'undefined'
  })
  overridableName?: string;
}
