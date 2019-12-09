
import { Client } from '@elastic/elasticsearch';
import * as bluebird from 'bluebird';
import 'reflect-metadata';
import { EsMappingService } from '../lib/es-mapping-ts';
import './resources/master.entity';

describe('es-mapping e2e:test', () => {

  it('should upload the mapping', async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

    const mappings = EsMappingService.getInstance().getMappingForIndex('master');
    expect(mappings).toBeDefined();

    const client = new Client({
      node: 'http://localhost:9200',
    });

    await client.ping();

    await bluebird.each(EsMappingService.getInstance().getAllIndex(), async (index) => {
      const indexExist = await client.indices.exists({ index });
      if (indexExist.body) {
        await client.indices.delete({ index });
      }
    });

    await EsMappingService.getInstance().uploadMappings(client);
  });

  it('should re-upload the mapping', async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

    const mappings = EsMappingService.getInstance().getMappingForIndex('master');
    expect(mappings).toBeDefined();

    const client = new Client({
      node: 'http://localhost:9200',
    });

    await client.ping();

    await EsMappingService.getInstance().uploadMappings(client);
  });

  it('should fail to upload mapping', async () => {
    // wrong client
    const client = new Client({
      node: 'http://localhost:9300',
    });
    try {
      await EsMappingService.getInstance().uploadMappings(client);
      expect(true).toBeFalsy();
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

});
