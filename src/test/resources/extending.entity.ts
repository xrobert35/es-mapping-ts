import { EsEntity, EsField } from '../../lib/es-mapping-ts';
import { MasterEntity } from './master.entity';

@EsEntity({
  index: 'extending',
  type: 'typeExtending',
})
export class ExtendingEntity extends MasterEntity {

  @EsField({
    type: 'text',
  })
  extendend?: string;

}
