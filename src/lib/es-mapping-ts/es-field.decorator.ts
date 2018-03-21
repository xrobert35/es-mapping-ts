import { EsMappingService } from "./es-mapping.service";

/**
 * Argument for a simple elasticsearch field
 */
export class EsFieldArgs {
  /** Type of the field : "text" | "integer" | */
  type: string;
  /** Name of the field : if it need to be different of the property name*/
  name?: string;
  /** Analyzer type */
  analyzer?: string;
}

/**
 * @EsField decorator : registrer the field in the mapping through the EsMappingService
 * @param args decorator annotation
 */
export function EsField(args: EsFieldArgs): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    EsMappingService.getInstance().addField(args, target, propertyKey);
  };
}