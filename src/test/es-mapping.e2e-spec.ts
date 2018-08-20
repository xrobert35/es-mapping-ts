
import 'reflect-metadata';
import './resources/master.entity';
import { EsMappingService } from '../lib/es-mapping-ts';
import { Client } from 'elasticsearch';

describe('es-mapping e2e:test', () => {

  it('should upload the mapping', async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

    const mappings = EsMappingService.getInstance().getMappingForIndex('master');
    expect(mappings).toBeDefined();

    const client = new Client({
      host: 'http://localhost:9200',
      log: 'info'
    });

    await client.ping({
      requestTimeout: 1000
    });

    await EsMappingService.getInstance().uploadMappings(client);
  });

});
