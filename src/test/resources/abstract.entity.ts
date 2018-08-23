import { EsField } from '../../lib/es-mapping-ts';


export class AbstractEntity {

  @EsField({
    type: 'text',
  })
  abstractName: string;

  @EsField({
    type: 'text',
  })
  overridableName: string;

}
