import { EsEntity, EsField } from '../../lib/es-mapping-ts';

@EsEntity()
export class DetailsMixin {

  @EsField({
    type: 'text',
  })
  firstname: string;

  @EsField({
    type: 'text',
  })
  lastname: string;
}
