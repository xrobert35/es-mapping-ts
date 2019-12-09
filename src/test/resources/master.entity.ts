import { EsEntity, EsField } from '../../lib/es-mapping-ts';
import { NestedEntity } from './nested.entity';
import { ObjectEntity } from './object.entity';

@EsEntity({
  index: 'master',
  type: 'masterType',
})
export class MasterEntity {

  @EsField({
    type: 'text',
  })
  name?: string;

  @EsField({
    type: 'text',
    copy_to : 'name',
  })
  firstname: string;

  @EsField({
    type: 'text',
    copy_to : 'name',
  })
  lastname: string;

  @EsField({
    enabled: false,
    name: 'customName',
  })
  notIndexed: string;

  @EsField({
    type: 'object',
    fieldClass: ObjectEntity,
  })
  objects: ObjectEntity[];

  @EsField({
    type: 'object',
  })
  warningObjects: ObjectEntity[];

  @EsField({
    type: 'object',
  })
  warningObject: ObjectEntity;

  @EsField({
    type: 'nested',
    fieldClass: NestedEntity,
    dynamic : 'strict',
  })
  nesteds: NestedEntity[];

  @EsField({
    type: 'nested',
    dynamic : 'strict',
  })
  nestedWarnings: NestedEntity[];
}
