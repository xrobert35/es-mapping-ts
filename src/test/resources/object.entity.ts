import { EsEntity, EsField } from '../../lib/es-mapping-ts';

@EsEntity()
export class ObjectEntity {

  @EsField({
    type: 'text',
    analyzer : 'whitespace',
  })
  name: string;

  @EsField({
    type: 'integer',
  })
  age: number;

  @EsField({
    name: 'date_of_birth',
    type: 'text',
  })
  dateOfBirth: string;
}
