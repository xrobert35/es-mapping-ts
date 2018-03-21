# Es Mapping Ts

#### This library is used to generate elasticsearch mapping through typescript decorator

## Installation

```sh
npm install es-mapping-ts --save
```

## Exemple

### Create the mapping 
```typescript
import { EsEntity, EsField, EsNestedField } from "es-mapping-ts";
import { DogEntity } from "./dog.entity";

@EsEntity({
  index: 'user',
  type: 'user'
})
export class UserEntity {

  @EsField({
    type: "text",
    analyzer : 'whitespace'
  })
  name: string;

  @EsField({
    type: "integer",
  })
  age: number;

  @EsNestedField()
  dog: DogEntity;
}
```

### Get the generated mappings

```typescript
import { EsMappingService } from 'es-mapping-ts';

//List of ready to use generated mapping
const mappings = EsMappingService.getInstance().getMappings();

Bluebird.each(mappings, async (mapping) => {
    //create index
    await esclient.indices.create({ index: mapping.index  });

    //create mapping
    await esclient.indices.putMapping(mapping);
});
```

## Decorator liste

#### @EsEntity
| Param | Type |  Description |
| ------ | ------ | ------ |
| index | string | Allow you to define the index name |
| type | string | Allow you to define the index type |

#### @EsField
| Param | Type |  Description |
| ------ | ------ | ------ |
| type | string | Allow you to define the type of the index |
| name | string | Allow you to define the name of the property if different from the property name |
| analyzer | string | Allow you to define the elasticsearch analyzer |

#### @EsNested

Define a basic field of type nested

| Param | Type |  Description |
| ------ | ------ | ------ |
| name | string | Allow you to define the name of the property if different from the property name |

Warning : The nested class must be an @EsEntity

# License
----

MIT
