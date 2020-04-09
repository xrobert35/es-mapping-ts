import 'reflect-metadata';
import { EsMappingService } from '../lib/es-mapping-ts';
import './resources/concret.entity';
import './resources/dynamic.entity';
import './resources/extending.entity';
import './resources/master.entity';
import { ObjectEntity } from './resources/object.entity';
import { ReadOnlyEntity } from './resources/read-only.entity';

describe('es-mapping unit:test', () => {

  it('Mapping for type "masterType" should exist', () => {
    const mapping = EsMappingService.getInstance().getMappingForType('masterType');
    expect(mapping).toBeDefined();
  });

  it('Mapping for index "extending" should exist', () => {
    const mapping = EsMappingService.getInstance().getMappingForIndex('extending');
    expect(mapping).toBeDefined();

    expect(mapping.body).toBeDefined();

    expect(mapping.index).toEqual('extending');
    expect(mapping.type).toEqual('typeExtending');

    expect(mapping.body.properties.name).toBeDefined();
    expect(mapping.body.properties.name.type).toEqual('text');

    expect(mapping.body.properties.firstname).toBeDefined();
    expect(mapping.body.properties.firstname.copy_to).toEqual('name');

    expect(mapping.body.properties.notIndexed).not.toBeDefined();
    expect(mapping.body.properties.customName).toBeDefined();
    expect(mapping.body.properties.customName.name).not.toBeDefined();
    expect(mapping.body.properties.customName.enabled).toEqual(false);

    expect(mapping.body.properties.lastname).toBeDefined();
    expect(mapping.body.properties.lastname.copy_to).toEqual('name');

    expect(mapping.body.properties.extendend).toBeDefined();
    expect(mapping.body.properties.extendend.type).toEqual('text');

    expect(mapping.body.properties.objects).toBeDefined();
    expect(mapping.body.properties.objects.type).toEqual('object');
    expect(mapping.body.properties.objects.properties).toBeDefined();
    expect(mapping.body.properties.objects.fieldClass).not.toBeDefined();

    expect(mapping.body.properties.nesteds).toBeDefined();
    expect(mapping.body.properties.nesteds.type).toEqual('nested');
    expect(mapping.body.properties.nesteds.dynamic).toEqual('strict');
    expect(mapping.body.properties.nesteds.fieldClass).not.toBeDefined();
    expect(mapping.body.properties.nesteds.properties).toBeDefined();

  });

  it('Mapping for index "concret" should exist', () => {
    const mapping = EsMappingService.getInstance().getMappingForIndex('concret');
    expect(mapping).toBeDefined();

    expect(mapping.body.properties.abstractName).toBeDefined();
    expect(mapping.body.properties.abstractName.type).toEqual('text');

    expect(mapping.body.properties.overridableName).toBeDefined();
    expect(mapping.body.properties.overridableName.type).toEqual('text');
    expect(mapping.body.properties.overridableName.null_value).toEqual('undefined');

    expect(mapping.body.properties.concretName).toBeDefined();
    expect(mapping.body.properties.concretName.type).toEqual('text');
  });

  it('Mapping for index "dynamic-strict" should exist', () => {
    const mapping = EsMappingService.getInstance().getMappingForType('dynamicStrict');
    expect(mapping).toBeDefined();

    expect(mapping.index).toEqual('dynamic-strict');
    expect(mapping.dynamic).toEqual('strict');
  });

  it('Mapping for index "dynamic-true" should exist', () => {
    const mapping = EsMappingService.getInstance().getMappingForType('dynamicTrue');
    expect(mapping).toBeDefined();

    expect(mapping.index).toEqual('dynamic-true');
    expect(mapping.dynamic).toBe(true);
  });

  it('Mapping for index "dynamic-false" should exist', () => {
    const mapping = EsMappingService.getInstance().getMappingForType('dynamicFalse');
    expect(mapping).toBeDefined();

    expect(mapping.index).toEqual('dynamic-false');
    expect(mapping.dynamic).toBe(false);
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

  it('Mapping for class unknow should not exist', () => {
    const mapping = EsMappingService.getInstance().getMappingForClass('unknow');
    expect(mapping).toBeNull();
  });

  it('Mapping for type unknow should not exist', () => {
    const mapping = EsMappingService.getInstance().getMappingForType('unknow');
    expect(mapping).toBeNull();
  });

  it('Mapping for type "masterType" should exist', () => {
    const mapping = EsMappingService.getInstance().getMappingForIndex('master');
    expect(mapping).toBeDefined();
    expect(mapping.body).toBeDefined();
    expect(mapping.index).toEqual('master');
    expect(mapping.type).toEqual('masterType');
    expect(mapping.body.properties.name).toBeDefined();
    expect(mapping.body.properties.name.type).toEqual('text');

    expect(mapping.body.properties.firstname).toBeDefined();
    expect(mapping.body.properties.firstname.copy_to).toEqual('name');

    expect(mapping.body.properties.notIndexed).not.toBeDefined();
    expect(mapping.body.properties.customName).toBeDefined();
    expect(mapping.body.properties.customName.name).not.toBeDefined();
    expect(mapping.body.properties.customName.enabled).toEqual(false);

    expect(mapping.body.properties.lastname).toBeDefined();
    expect(mapping.body.properties.lastname.copy_to).toEqual('name');

    expect(mapping.body.properties.objects).toBeDefined();
    expect(mapping.body.properties.objects.type).toEqual('object');
    expect(mapping.body.properties.objects.properties).toBeDefined();
    expect(mapping.body.properties.objects.fieldClass).not.toBeDefined();

    expect(mapping.body.properties.nesteds).toBeDefined();
    expect(mapping.body.properties.nesteds.type).toEqual('nested');
    expect(mapping.body.properties.nesteds.dynamic).toEqual('strict');
    expect(mapping.body.properties.nesteds.fieldClass).not.toBeDefined();
    expect(mapping.body.properties.nesteds.properties).toBeDefined();
  });

  it('should return mappings map', () => {
    const mappings = EsMappingService.getInstance().getMappings();
    expect(mappings.length).toEqual(10);
  });

  it('should return mapping indexes', () => {
    const indexes = EsMappingService.getInstance().getAllIndex();
    expect(indexes.length).toEqual(7);
  });

  it('should return es mappings', () => {
    const esMappings = EsMappingService.getInstance().getEsMappings();
    expect(esMappings.length).toEqual(10);
  });

  it('should return mappings', () => {
    const mappings = EsMappingService.getInstance().getMappings();
    expect(mappings.length).toEqual(10);
  });

  it('should return the mapping map', () => {
    const mappingsMap = EsMappingService.getInstance().getMappingsMap();
    expect(mappingsMap).toBeDefined();
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
    expect(mapping).toBeDefined();

    const mappings = EsMappingService.getInstance().getMappings();
    const readonlyMappings = mappings.filter((m) => m.readonly);
    expect(readonlyMappings).toHaveLength(1);
  });
});
