import { EsEntity, EsField } from '../../lib/es-mapping-ts';
import { DetailsMixin } from './details.mixin';

@EsEntity({mixins: [DetailsMixin]})
export class MixedEntity {

  @EsField({
    type : 'text',
  })
  id: string;
}
