import { EsEntity, EsField } from '../../lib/es-mapping-ts';

@EsEntity({
  index: 'dynamic-strict',
  type: 'dynamicStrict',
  dynamic: 'strict',
})
export class DynamicStrictEntity {
  @EsField({
    type: 'text',
  })
  field: string;
}

@EsEntity({
  index: 'dynamic-true',
  type: 'dynamicTrue',
  dynamic: true,
})
export class DynamicTrueEntity {
  @EsField({
    type: 'text',
  })
  field: string;
}

@EsEntity({
  index: 'dynamic-false',
  type: 'dynamicFalse',
  dynamic: false,
})
export class DynamicFalseEntity {
  @EsField({
    type: 'text',
  })
  field: string;
}
