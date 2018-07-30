import { EsMappingService } from "./es-mapping.service";
import 'reflect-metadata';

/**
 * Argument for a simple elasticsearch field
 */
export class EsFieldArgs {
  /** Type of the field : "text" | "integer" | */
  type: string;
  /** Name of the field : if it need to be different of the property name*/
  name?: string;
  /** Additional properties or not */
  dynamic?: boolean;
  /** Analyzer type */
  analyzer?: string;
  /** Additionnal ES fields **/
  fields?: any;
  /** Format */
  format?: any;
  /** Enabled */
  enabled?: boolean;
  /** Define the null value */
  null_value?: any;
  /** copy into a group field */
  copy_to?: string;
  /** Relations for join datatype */
  relations?: any;
  /** Define class for "array/nested" type */
  fieldClass?: any
  /** Additional properties */
  [x: string]: any;
}

/**
 * @EsField decorator : registrer the field in the mapping through the EsMappingService
 * @param args decorator annotation
 */
export function EsField(args: EsFieldArgs): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {

    let propertyType = Reflect.getMetadata("design:type", target, propertyKey);
    if (args.type === 'join' && !args.relations) {
      throw new Error(`es-mapping-error no relations defined for join datatype : ${target.constructor.name}:${<string>propertyKey}`);
    }

    if (args.type === 'nested') {
      if (propertyType.name !== 'Array') {
        throw new Error(`es-mapping-error type of a nested field must be an array : ${target.constructor.name}:${<string>propertyKey}`);
      }
      if (!args.fieldClass) {
        console.warn(`es-mapping-warning no fieldClass defined for nested datatype : ${target.constructor.name}:${<string>propertyKey}`)
      }
    }

    if (args.type === 'object' && !args.fieldClass) {
      if (propertyType.name === 'Array') {
        console.warn(`es-mapping-warning no fieldClass defined for object array datatype : ${target.constructor.name}:${<string>propertyKey}`)
      }
    }

    if (args.fieldClass) {
      propertyType = args.fieldClass;
    }

    EsMappingService.getInstance().addField(args, target, propertyKey, propertyType);
  };
}
