import { EsEntity, EsField } from '../../lib/es-mapping-ts';
import { ObjectEntity } from './object.entity';
import { NestedEntity } from './nested.entity';

@EsEntity({
  index: 'master',
  type: 'masterType'
})
export class MasterEntity {

  @EsField({
    type: 'text'
  })
  name?: string;

  @EsField({
    type: 'text',
    copy_to : 'name'
  })
  firstname: string;

  @EsField({
    type: 'text',
    copy_to : 'name'
  })
  lastname: string;

  @EsField({
    enabled: false,
    name: 'customName'
  })
  notIndexed: string;

  @EsField({
    type: 'object',
    fieldClass: ObjectEntity
  })
  objects: Array<MasterEntity>;

  @EsField({
    type: 'nested',
    fieldClass: NestedEntity,
    dynamic : 'strict',
  })
  nesteds: Array<NestedEntity>;
}
