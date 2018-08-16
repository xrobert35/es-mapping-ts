import 'reflect-metadata';
import './resources/master.entity';
import { EsMappingService } from '../lib/es-mapping-ts';
import { Client } from 'elasticsearch';
import { ObjectEntity } from "./resources/object.entity";
import { ReadOnlyEntity } from "./resources/read-only.entity";

describe('es-mapping-test', () => {

  it('Mapping for type "masterType" should exist', () => {
    const mappings = EsMappingService.getInstance().getMappingForType('masterType');
    expect(mappings).toBeDefined();
  });

  it('Mapping for index "master" should exist', () => {
    const mappings = EsMappingService.getInstance().getMappingForIndex('master');
    expect(mappings).toBeDefined();
  });

  it('Mapping for index "nestedInd" should exist', () => {
    const mappings = EsMappingService.getInstance().getMappingForIndex('nestedInd');
    expect(mappings).toBeDefined();
  });

  it('Mapping for index "object" should not exist', () => {
    const mappings = EsMappingService.getInstance().getMappingForIndex('object');
    expect(mappings).toBeNull();
  });

  it('Mapping for class "ObjectEntity" should exist', () => {
    const mappings = EsMappingService.getInstance().getMappingForClass('ObjectEntity');
    expect(mappings).toBeDefined();
  });

  it('Mapping for type "masterType" should exist', () => {
    const mapping = EsMappingService.getInstance().getMappingForIndex('master');
    expect(mapping).toBeDefined();
    expect(mapping.body).toBeDefined();
    expect(mapping.index).toEqual('master');
    expect(mapping.type).toEqual('masterType');
    expect(mapping.body.properties.name).toBeDefined();

    expect(mapping.body.properties.firstname).toBeDefined();
    expect(mapping.body.properties.lastname).toBeDefined();
    expect(mapping.body.properties.objects).toBeDefined();
    expect(mapping.body.properties.objects.type).toEqual('object');
    expect(mapping.body.properties.objects.properties).toBeDefined();

    expect(mapping.body.properties.nesteds).toBeDefined();
    expect(mapping.body.properties.nesteds.type).toEqual('nested');
    expect(mapping.body.properties.nesteds.properties).toBeDefined();
  });

  it('should return mappings map', () => {
    const mappings = EsMappingService.getInstance().getMappings();

    console.log(mappings);

    expect(mappings.length).toEqual(4);
  });

  it('should return mapping indexes', () => {
    const indexes = EsMappingService.getInstance().getAllIndex();
    expect(indexes.length).toEqual(2);
  });

  it('should return es mappings', () => {
    const esMappings = EsMappingService.getInstance().getEsMappings();
    expect(esMappings.length).toEqual(4);
  });

  it('should return mappings', () => {
    const mappings = EsMappingService.getInstance().getMappings();
    expect(mappings.length).toEqual(4);
  });

  it('should not load entity with non array nested field', () => {
    try {
      require('./resources/wrong-nested.entity');
    } catch (err) {
      expect(err).toBeDefined();
      expect(err.message).toEqual('es-mapping-error type of a nested field must be an array : WrongNestedEntity:nesteds');
    }
  });

  it('should not load entity with join relation without relations defined', () => {
    try {
      require('./resources/wrong-relation.entity');
    } catch (err) {
      expect(err).toBeDefined();
      expect(err.message).toEqual('es-mapping-error no relations defined for join datatype : WrongRelationEntity:relations');
    }
  });

  it('should upload the mapping', async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

    const mappings = EsMappingService.getInstance().getMappingForIndex('master');
    expect(mappings).toBeDefined();

    const client = new Client({
      host: 'http://localhost:9200',
      log : 'info'
    });

    await client.ping({
      requestTimeout: 1000
    });

    await EsMappingService.getInstance().uploadMappings(client);
  });

  it('should rename keys if name is provided', () => {
    const mapping = EsMappingService.getInstance().getMappingForClass(ObjectEntity.name);
    const properties = Object.keys(mapping.body.properties);
    expect(properties.includes('date_of_birth')).toBeTruthy();
  });

  it('should not add name to the es mapping', () => {
    const mapping = EsMappingService.getInstance().getMappingForClass(ObjectEntity.name);
    const dob = mapping.body.properties['date_of_birth'];
    const fields = Object.keys(dob);
    expect(fields.includes('name')).toBeFalsy();
  });

  it('should create a read only entity', () => {
    const mapping = EsMappingService.getInstance().getMappingForClass(ReadOnlyEntity.name);
    expect(mapping).toBeDefined()

    const mappings = EsMappingService.getInstance().getMappings();
    const readonlyMappings = mappings.filter(m => m.readonly);
    expect(readonlyMappings).toHaveLength(1);
  });
});
