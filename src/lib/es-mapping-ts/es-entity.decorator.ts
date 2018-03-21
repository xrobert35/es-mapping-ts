import { EsMappingService } from "./es-mapping.service";

/**
 * Argument for an elasticsearch index
 */
export class EsEntityArgs {
  /** Name of the index */
  index: string;
  /** Type of the index */
  type: string;
}

/**
 * @EsEntity decorator : registrer the entity in the mapping through the EsMappingService
 * @param args decorator annotation
 */
export function EsEntity(args: EsEntityArgs): ClassDecorator {
  return function (target: any) {
    EsMappingService.getInstance().addEntity(args, target);
  }
}