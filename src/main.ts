import './example/user.entity';
import './example/dog.entity';
import './example/master.entity';
import { EsMappingService } from './lib/es-mapping-ts';

const mappings = EsMappingService.getInstance().getMappingForType('user');
console.log(JSON.stringify(mappings, null, 2));
