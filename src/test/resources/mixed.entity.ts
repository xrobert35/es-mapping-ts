import { EsEntity, EsField } from '../../lib/es-mapping-ts';
import { ObjectEntity } from './object.entity';
import { NestedEntity } from './nested.entity';
import { DetailsMixin } from './details.mixin';

@EsEntity({mixins: [DetailsMixin]})
export class MixedEntity {

  @EsField({
    type : 'text'
  })
  id: string;
}
