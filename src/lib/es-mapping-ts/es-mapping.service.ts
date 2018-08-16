import { EsMapping, EsMappingProperty, InternalEsMapping, InternalEsMappingProperty } from './es-mapping';
import { EsFieldArgs } from './es-field.decorator';
import { EsEntityArgs } from './es-entity.decorator';
import * as lodash from 'lodash';
import * as bluebird from 'bluebird';
import { Client } from 'elasticsearch';

/**
 * Service used to manage mapping loading and share it
 */
export class EsMappingService {

  static instance: EsMappingService;

  esMappings: Map<String, InternalEsMapping> = new Map();

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
  addEntity(args: EsEntityArgs, target: any): void {
    const className = target.name;
    let mapping = this.esMappings.get(className);
    if (!mapping) {
      mapping = new InternalEsMapping();
      this.esMappings.set(className, mapping);
    }

    if (args) {
      if (args.index) {
        mapping.esmapping.index = args.index;
      }
      if (args.type) {
        mapping.esmapping.type = args.type as any;
      }

      if (args.readonly) {
        mapping.readonly = args.readonly === true;
      }

      if (args.mixins) {
        for (const mixin of args.mixins) {
          const esEntity = this.esMappings.get(mixin.name);
          if (esEntity) {
            const properties = esEntity.esmapping.body.properties;

            for (const propertyName of Object.keys(properties)) {
              const internalProperty: InternalEsMappingProperty = {
                propertyMapping: properties[propertyName]
              };

              mapping.addProperty(propertyName, internalProperty);
            }
          }
        }
      }
    }
    mapping.mergeEsMapping();
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
      mapping.mergeEsMapping();
    }

    let properties: EsMappingProperty = {};
    if (args.type === 'nested' || args.type === 'object') {
      properties.type = args.type;
      const esEntity = this.esMappings.get(propertyType.name);
      if (esEntity) {
        properties.properties = esEntity.esmapping.body.properties;
      }
    } else {
      properties = args;
    }

    const internalProperty: InternalEsMappingProperty = {
      propertyMapping: properties
    };

    const propertyName = args.name || propertyKey;
    mapping.addProperty(propertyName, internalProperty);
  }

  /**
   * Alllow you to get the generated mapping list ready to be inserted inside elasticsearch
   */
  public getMappings(): Array<InternalEsMapping> {
    return Array.from(this.esMappings.values());
  }

  /**
   * Allow you to get all index
   */
  public getEsMappings(): Array<EsMapping> {
    return lodash.map(Array.from(this.esMappings.values()), (mapping) => {
      return mapping.esmapping;
    });
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
  public getMappingForClass(className: String): EsMapping {
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
  public getMappingForIndex(indexName: String): EsMapping {
    const internalMapping = lodash.find(Array.from(this.esMappings.values()), (internalEsMapping) => {
      return internalEsMapping.esmapping.index === indexName;
    });

    if (internalMapping) {
      return internalMapping.esmapping;
    }
    return null;
  }

  /**
 * Alllow you to get the generated mapping  eady to be inserted inside elasticsearch
 * for an type
 */
  public getMappingForType(type: String): EsMapping {
    const internalMapping = lodash.find(Array.from(this.esMappings.values()), (internalEsMapping) => {
      return internalEsMapping.esmapping.type === type;
    });

    if (internalMapping) {
      return internalMapping.esmapping;
    }
    return null;
  }

  /**
   * Allow you to get all index
   */
  public getAllIndex(): Array<String> {
    return lodash.map(lodash.filter(Array.from(this.esMappings.values()), (mapping) => {
      return mapping.esmapping.index;
    }), (mapping) => {
      return mapping.esmapping.index;
    });
  }

  /**
   * Allow to insert/update mapping into elasticsearch
   */
  public async uploadMappings(esclient: Client) {
    const mappings = EsMappingService.getInstance().getMappings();

    await bluebird.each(mappings, async (internalMapping) => {
      if (!internalMapping.readonly) {
        const esMapping = internalMapping.esmapping;

        if (esMapping.index) {
          try {
            // Delete readonly for ES compatibility
            delete internalMapping.readonly;

            const indexExist = await esclient.indices.exists({ index: esMapping.index });
            if (!indexExist) {
              // create index
              await esclient.indices.create({ index: esMapping.index });
              // create mapping
              await esclient.indices.putMapping(esMapping);
            } else {
              // update mapping
              await esclient.indices.putMapping(esMapping);
            }
          } catch (err) {
            console.error(`Something went wrong when trying to upload mapping for ${esMapping.index}`, err);
            throw err;
          }
        }
      }
    });
  }
}
