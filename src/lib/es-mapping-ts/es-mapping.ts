
import { cloneDeep } from 'lodash';

/**
 * Base format of an elasticsearch mapping
 */
export class EsMapping {
  index: string;
  type: string;
  include_type_name: boolean;
  body: { properties: any };

  constructor() {
    this.body = { properties: {} };
  }
}

/**
 * Internal mapping to handle specific parameter
 */
export class InternalEsMapping {
  index: string;
  type: string;
  readonly: boolean;
  esmapping: EsMapping = new EsMapping();
  properties: Map<string | symbol, InternalEsMappingProperty> = new Map();

  addProperty(name: string | symbol, mapping: InternalEsMappingProperty): void {
    this.properties.set(name, mapping);

    const propertyMapping = cloneDeep(mapping.propertyMapping);

    // remove the name field from the es-mapping
    delete (propertyMapping as any).name;

    this.esmapping.body.properties[name] = propertyMapping;
  }
}

/**
 * Base format of an elasticsearch property
 */
export interface EsMappingProperty {
  type?: string;
  analyzer?: string;
  properties?: any;
  fields?: any;
}

/**
 * Base format of an elasticsearch property
 */
export interface InternalEsMappingProperty extends EsMappingProperty {
  propertyMapping: EsMappingProperty;
  transformers?: EsMappingPropertyTranformer[];
}

export interface EsMappingPropertyTranformer {
  fieldName: string;
  transformer: EsPropertyTranformer;
}

export interface EsPropertyTranformer {
  transform(input: any);
}
