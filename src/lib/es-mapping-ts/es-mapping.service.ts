import { Client } from '@elastic/elasticsearch';
import { EsEntityArgs } from './es-entity.decorator';
import { EsFieldArgs } from './es-field.decorator';
import { EsMapping, EsMappingProperty, InternalEsMapping, InternalEsMappingProperty } from './es-mapping';

/**
 * Service used to manage mapping loading and share it
 */
export class EsMappingService {

  static instance: EsMappingService;

  esMappings: Map<string, InternalEsMapping> = new Map();

  constructor() { }

  /**
   * Get the singleton instance
   */
  static getInstance(): EsMappingService {
    if (!EsMappingService.instance) {
      const esMappingService = new EsMappingService();
      EsMappingService.instance = esMappingService;
    }
    return EsMappingService.instance;
  }

  /**
   * Add the entity in the mapping
   * @param args decorator args
   * @param target class
   */
  addEntity(args: EsEntityArgs, target: any, superClass: any): void {
    const className = target.name;
    const mapping = this.esMappings.get(className);

    const mergeProperties = (properties) => {
      for (const propertyName of Object.keys(properties)) {
        const currentMappingProperty = mapping.properties.get(propertyName);
        let internalProperty: InternalEsMappingProperty = null;
        if (!currentMappingProperty) {
          internalProperty = {
            propertyMapping: properties[propertyName],
          };
        } else {
          internalProperty = {
            propertyMapping: {
              ...properties[propertyName],
              ...currentMappingProperty.propertyMapping,
            },
          };
        }
        mapping.addProperty(propertyName, internalProperty);
      }
    };

    if (superClass) {
      const superClassMapping = this.esMappings.get(superClass);
      if (superClassMapping) {
        mergeProperties(superClassMapping.esmapping.body.properties);
      }
    }

    if (args) {
      mapping.esmapping.index = args.index;
      mapping.esmapping.type = args.type as any;
      mapping.readonly = args.readonly === true;

      if (args.mixins) {
        for (const mixin of args.mixins) {
          const esEntity = this.esMappings.get(mixin.name);
          if (esEntity) {
            mergeProperties(esEntity.esmapping.body.properties);
          }
        }
      }
    }
  }

  /**
   * Add the field in the mapping
   * @param args decorator args
   * @param target class
   * @param propertyKey the property
   */
  addField(args: EsFieldArgs, target: any, propertyKey: string | symbol, propertyType?: any): void {
    const className = target.constructor.name;
    let mapping = this.esMappings.get(className);
    if (!mapping) {
      mapping = new InternalEsMapping();
      this.esMappings.set(className, mapping);
    }

    const properties: EsMappingProperty = args;
    if (args.type === 'nested' || args.type === 'object') {
      properties.type = args.type;
      const esEntity = this.esMappings.get(propertyType.name);
      if (esEntity) {
        properties.properties = esEntity.esmapping.body.properties;
      }
    }

    const internalProperty: InternalEsMappingProperty = {
      propertyMapping: properties,
    };

    const propertyName = args.name || propertyKey;
    mapping.addProperty(propertyName, internalProperty);
  }

  /**
   * Alllow you to get the generated mapping list ready to be inserted inside elasticsearch
   */
  public getMappings(): InternalEsMapping[] {
    return Array.from(this.esMappings.values());
  }

  /**
   * Allow you to get all index
   */
  public getEsMappings(): EsMapping[] {
    return Array.from(this.esMappings.values()).map((mapping) => mapping.esmapping);
  }

  /**
   * Allow you to get the generate mapping map
   */
  public getMappingsMap() {
    return this.esMappings;
  }

  /**
   * Alllow you to get the generated mapping ready to be inserted inside elasticsearch
   * for a class name
   */
  public getMappingForClass(className: string): EsMapping {
    const internalMapping = this.esMappings.get(className);

    if (internalMapping) {
      return internalMapping.esmapping;
    }
    return null;
  }

  /**
   * Alllow you to get the generated mapping  ready to be inserted inside elasticsearch
   * for an index name
   */
  public getMappingForIndex(indexName: string): EsMapping {
    const internalMapping = Array.from(this.esMappings.values())
      .find((internalEsMapping) => internalEsMapping.esmapping.index === indexName);

    if (internalMapping) {
      return internalMapping.esmapping;
    }
    return null;
  }

  /**
   * Alllow you to get the generated mapping  ready to be inserted inside elasticsearch
   * for an type
   */
  public getMappingForType(type: string): EsMapping {
    const internalMapping = Array.from(this.esMappings.values())
      .find((internalEsMapping) => internalEsMapping.esmapping.type === type);

    if (internalMapping) {
      return internalMapping.esmapping;
    }
    return null;
  }

  /**
   * Allow you to get all index
   */
  public getAllIndex(): string[] {
    // load mapping with index
    const mappings = Array.from(this.esMappings.values()).filter((mapping) => mapping.esmapping.index);
    return mappings.map((mapping) => mapping.esmapping.index);
  }

  /**
   * Allow to insert/update mapping into elasticsearch
   */
  public async uploadMappings(esclient: Client) {
    const mappings = EsMappingService.getInstance().getMappings();

    await Promise.all(mappings.map(async (internalMapping) => {
      if (!internalMapping.readonly) {
        const esMapping = internalMapping.esmapping;

        if (esMapping.index) {
          esMapping.include_type_name = true;
          // Delete readonly for ES compatibility
          delete internalMapping.readonly;

          const indexExist = await esclient.indices.exists({ index: esMapping.index });
          if (!indexExist.body) {
            // create index
            await esclient.indices.create({ index: esMapping.index });
            // create mapping
            await esclient.indices.putMapping(esMapping);
          } else {
            // update mapping
            await esclient.indices.putMapping(esMapping);
          }
        }
      }
    }));
  }
}
