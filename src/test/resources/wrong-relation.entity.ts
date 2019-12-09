import { EsEntity, EsField } from '../../lib/es-mapping-ts';

@EsEntity()
export class WrongRelationEntity {

  @EsField({
    type: 'join',
  })
  relations: WrongRelationEntity;
}
