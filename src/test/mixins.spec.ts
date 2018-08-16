import 'reflect-metadata';
import './resources/master.entity';
import { EsMappingService } from '../lib/es-mapping-ts';
import { MixedEntity } from './resources/mixed.entity';
import { DetailsMixin } from './resources/details.mixin';

describe('mixins', () => {

  it('should mixin classes', () => {
    const mixedMapping = EsMappingService.getInstance().getMappingForClass(MixedEntity.name);
    const mixin = EsMappingService.getInstance().getMappingForClass(DetailsMixin.name);

    expect(mixedMapping.body.properties['firstname']).toEqual(mixin.body.properties['firstname']);
    expect(mixedMapping.body.properties['lastname']).toEqual(mixin.body.properties['lastname']);
    expect(mixedMapping.body.properties['id']).toBeDefined();

    expect(Object.keys(mixedMapping.body.properties)).toEqual(['id', 'firstname', 'lastname']);

  });
});
