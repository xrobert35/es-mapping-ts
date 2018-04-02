import './example/user.entity';
import './example/dog.entity';

import { EsMappingService } from './lib/es-mapping-ts';

const mappings = EsMappingService.getInstance().getMappings();
console.log(JSON.stringify(mappings, null, 2));
