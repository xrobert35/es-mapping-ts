

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
  index: string;
  type: string;
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

    if (!mapping.propertyMapping) {
      return;
    }

    const propertyMapping = JSON.parse(JSON.stringify(mapping.propertyMapping));

    // remove the name field from the es-mapping
    delete propertyMapping.name

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
