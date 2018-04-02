

/**
 * Base format of an elasticsearch mapping
 */
export class EsMapping {
  index: string;
  type: string;
  readonly: boolean;
  body: { properties: any };

  constructor() {
    this.body = { properties: {} };
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
