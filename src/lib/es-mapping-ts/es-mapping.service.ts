import { EsMapping, EsMappingProperty } from "./es-mapping";
import { EsFieldArgs } from "./es-field.decorator";
import { EsEntityArgs } from "./es-entity.decorator";
import * as lodash from 'lodash';
import * as bluebird from 'bluebird';
import { Client } from 'elasticsearch';
import { EsNestedFieldArgs } from "./es-nested-field.decorator";

/**
 * Service used to manage mapping loading and share it
 */
export class EsMappingService {

  static instance: EsMappingService;

  esMappings: Map<String, EsMapping> = new Map();

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
      mapping = new EsMapping();
      this.esMappings.set(className, mapping);
    }
    mapping.index = args.index;
    mapping.type = args.type;
    mapping.readonly = args.readonly;
  }

  /**
   * Add the nested field in the mapping
   * @param _args decorator args
   * @param target class
   * @param propertyKey the property
   */
  addNestedField(_args: EsNestedFieldArgs, target: any, propertyKey: any, typeName: string): void {
    this.addField({ type: "nested" }, target, propertyKey, this.esMappings.get(typeName).body.properties);
  }

  /**
   * Add the field in the mapping
   * @param args decorator args
   * @param target class
   * @param propertyKey the property
   */
  addField(args: EsFieldArgs, target: any, propertyKey: string | symbol, nestedProperties?: any): void {
    const className = target.constructor.name;
    let mapping = this.esMappings.get(className);
    if (!mapping) {
      mapping = new EsMapping();
      this.esMappings.set(className, mapping);
    }

    let property: EsMappingProperty = {};
    if (args) {

      property = {
        type: args.type,
        analyzer: args.analyzer
      };

      if (nestedProperties) {
        property.properties = nestedProperties;
      }

      if(args.fields){
        property.fields = args.fields;
      }

      mapping.body.properties[args.name || propertyKey] = property;
    } else {
      mapping.body.properties[propertyKey] = {};
    }
  }

  /**
   * Alllow you to get the generated mapping list ready to be inserted inside elasticsearch
   */
  public getMappings(): Array<EsMapping> {
    return Array.from(this.esMappings.values());
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
    return this.esMappings.get(className);
  }

  /**
   * Alllow you to get the generated mapping  ready to be inserted inside elasticsearch
   * for an index name
   */
  public getMappingForIndex(indexName: String): EsMapping {
    return lodash.find(this.esMappings.values, (esMapping) => {
      return esMapping.index === indexName;
    });
  }

  /**
 * Alllow you to get the generated mapping  eady to be inserted inside elasticsearch
 * for an type
 */
  public getMappingForType(type: String): EsMapping {
    return lodash.find(this.esMappings.values, (esMapping) => {
      return esMapping.type === type;
    });
  }

  /**
   * Allow you to get all index
   */
  public getAllIndex(): Array<String> {
    return lodash.map(Array.from(this.esMappings.values()), (mapping) => {
      return mapping.index;
    });
  }

  /**
   * Allow to insert/update mapping into elasticsearch
   */
  public async uploadMappings(esclient : Client) {
    const mappings = EsMappingService.getInstance().getMappings();

    await bluebird.each(mappings, async (mapping) => {
      if(!mapping.readonly) {
        const index = mapping.index;

        const indexExist = await esclient.indices.exists({index: index});
        if (!indexExist) {
          //create index
          await esclient.indices.create({index: mapping.index});
          //create mapping
          await esclient.indices.putMapping(mapping);
        } else {
          //update mapping
          await esclient.indices.putMapping(mapping);
        }
      }
    });
  }
}
