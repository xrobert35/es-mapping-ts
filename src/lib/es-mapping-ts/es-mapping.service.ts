import { EsMapping, EsMappingProperty } from "./es-mapping";
import { EsFieldArgs } from "./es-field.decorator";
import { EsEntityArgs } from "./es-entity.decorator";
import * as lodash from 'lodash';
import { EsNestedFieldArgs } from "./es-nested-field.decorator";

/**
 * Service used to manage mapping loading and share it
 */
export class EsMappingService {

  static instance: EsMappingService;
  esMappings: Map<String, EsMapping> = new Map();

  constructor() {}

  /**
   * Get the singleton instance
   */
  static getInstance() {
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
  addEntity(args: EsEntityArgs, target: any) {
    const className = target.name;
    let mapping = this.esMappings.get(className);
    if (!mapping) {
      mapping = new EsMapping();
      this.esMappings.set(className, mapping);
    }
    mapping.index = args.index;
    mapping.type = args.type;
  }

  /**
   * Add the nested field in the mapping
   * @param _args decorator args
   * @param target class
   * @param propertyKey the property
   */
  addNestedField(_args: EsNestedFieldArgs, target: any, propertyKey: any, typeName: string): any {
    this.addField({ type: "nested" }, target, propertyKey, this.esMappings.get(typeName).body.properties);
  }

  /**
   * Add the field in the mapping
   * @param args decorator args
   * @param target class
   * @param propertyKey the property
   */
  addField(args: EsFieldArgs, target: any, propertyKey: string | symbol, nestedProperties? : any) {
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
        property['properties'] = nestedProperties;
      }

      mapping.body.properties[args.name || propertyKey] = property;
    } else {
      mapping.body.properties[propertyKey] = {};
    }
  }

  /**
   * Alllow you to get the generated mapping list ready to be inserted inside elasticsearch
   */
  public getMappings() {
    return Array.from(this.esMappings.values());
  }

  /**
   * Allow you to get all index
   */
  public getAllIndex() {
    return lodash.map(Array.from(this.esMappings.values()), ['index']);
  }
}