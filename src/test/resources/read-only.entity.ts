import { EsEntity, EsField } from '../../lib/es-mapping-ts';

@EsEntity({readonly: true})
export class ReadOnlyEntity {

  @EsField({
    type: 'text',
    analyzer : 'whitespace'
  })
  status: string;
}
