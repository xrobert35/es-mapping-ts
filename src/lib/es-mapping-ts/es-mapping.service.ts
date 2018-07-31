import { EsMapping, EsMappingProperty, InternalEsMapping, InternalEsMappingProperty } from "./es-mapping";
import { EsFieldArgs } from "./es-field.decorator";
import { EsEntityArgs } from "./es-entity.decorator";
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
      let esMappingService = new EsMappingService();
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
      mapping.esmapping.index = args.index;
      mapping.esmapping.type = args.type;
      mapping.readonly = (args.readonly === true);
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
    if (args) {
      if (args.type === 'nested' || args.type === 'object') {
        properties.type = args.type;
        const esEntity = this.esMappings.get(propertyType.name);
        if (esEntity) {
          properties.properties = esEntity.esmapping.body.properties;
        }
      } else {
        properties = args;
      }

      let internalProperty: InternalEsMappingProperty = {
        propertyMapping: properties
      };

      let propertyName = args.name || propertyKey;
      mapping.addProperty(propertyName, internalProperty);
    } else {
      let internalProperty: InternalEsMappingProperty = {
        propertyMapping: {}
      };
      mapping.addProperty(propertyKey, internalProperty);
    }
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
    return this.esMappings.get(className).esmapping;
  }

  /**
   * Alllow you to get the generated mapping  ready to be inserted inside elasticsearch
   * for an index name
   */
  public getMappingForIndex(indexName: String): EsMapping {
    return lodash.find(Array.from(this.esMappings.values()), (internalEsMapping) => {
      return internalEsMapping.esmapping.index === indexName;
    }).esmapping;
  }

  /**
 * Alllow you to get the generated mapping  eady to be inserted inside elasticsearch
 * for an type
 */
  public getMappingForType(type: String): EsMapping {
    return lodash.find(Array.from(this.esMappings.values()), (internalEsMapping) => {
      return internalEsMapping.esmapping.type === type;
    }).esmapping;
  }

  /**
   * Allow you to get all index
   */
  public getAllIndex(): Array<String> {
    return lodash.map(Array.from(this.esMappings.values()), (mapping) => {
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
          // Delete readonly for ES compatibility
          delete internalMapping.readonly;

          const indexExist = await esclient.indices.exists({ index: esMapping.index });
          if (!indexExist) {
            //create index
            await esclient.indices.create({ index: esMapping.index });
            //create mapping
            await esclient.indices.putMapping(esMapping);
          } else {
            //update mapping
            await esclient.indices.putMapping(esMapping);
          }
        }
      }
    });
  }
}
