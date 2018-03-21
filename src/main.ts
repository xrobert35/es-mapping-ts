import { UserEntity } from './example/user.entity';
import { DogEntity } from './example/dog.entity';

import { EsMappingService } from './lib/es-mapping-ts';

console.log(UserEntity, DogEntity);
const mappings = EsMappingService.getInstance().getMappings();
console.log(mappings);