import { EsMappingService } from "./es-mapping.service";
import 'reflect-metadata';

/**
 * Argument for a elasticsearch nested field
 */
export class EsNestedFieldArgs {
}

/**
 * @EsNestedField decorator : registrer the nested field in the mapping through the EsMappingService
 * @param args decorator annotation
 */
export function EsNestedField(args?: EsNestedFieldArgs): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {

    const type = Reflect.getMetadata("design:type", target, propertyKey);
    EsMappingService.getInstance().addNestedField(args, target, propertyKey, type.name);
  };
}