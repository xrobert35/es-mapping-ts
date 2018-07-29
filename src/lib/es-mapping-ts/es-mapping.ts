

/**
 * Base format of an elasticsearch mapping
 */
export class EsMapping {
  index: string;
  type: string;
  body: { properties: any };

  constructor() {
    this.body = { properties: {} };
  }
}

/**
 * Internal mapping to handle specific parameter
 */
export class InternalEsMapping {
  readonly: boolean;
  esmapping: EsMapping;
  properties: Map<string | symbol, InternalEsMappingProperty> = new Map();

  constructor() {
    this.esmapping = new EsMapping();
  }

  mergeEsMapping(): void {
    if (!this.esmapping) {
      this.esmapping = new EsMapping();
    }
    this.esmapping.index = this.esmapping.index;
    this.esmapping.type = this.esmapping.type;
  }

  addProperty(name: string | symbol, mapping: InternalEsMappingProperty): void {
    this.properties.set(name, mapping);
    this.esmapping.body.properties[name] = mapping.propertyMapping;
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
