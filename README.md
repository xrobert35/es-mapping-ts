# Es Mapping Ts

#### This library is used to generate elasticsearch mapping through typescript decorator

## Installation

```sh
npm install es-mapping-ts --save
```

## Exemple

### Create the mapping 
```typescript
import { EsEntity, EsField } from "../lib/es-mapping-ts";
import { BudgetEntity } from "./budget.entity";
import { UsertEntity } from "./user.entity";
import { MasterEntity } from "./master.entity";

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

  @EsField({
    type: 'join',
    relations: { "parent" : "child"}
  })
  children: Array<UserEntity>;

  @EsField({
    type: 'object'
  })
  budget: BudgetEntity;

  @EsField({
    type: 'object',
    fieldClass : BudgetEntity
  })
  budgets: Array<BudgetEntity>;

  @EsField({
    type: 'nested',
    fieldClass : MasterEntity
  })
  master: Array<MasterEntity>;
}
```

* MasterEntity,  UserEntity and BudgetEntity must be annoted by EsEntity() 

### Get the generated mappings

#### Simply call the "uploadMappings"  function
```typescript
import { EsMappingService } from 'es-mapping-ts';
import { Client } from 'elasticsearch';

const esClient = new Client();

// Upload the mapping
const mappings = EsMappingService.getInstance().uploadMappings(esClient);
```

only none readonly entity will be uploaded


#### or do it yourself

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
| readonly | boolean | Define if the mapping must be uploaded when using uploadMappings function |

#### @EsField
| Param | Type |  Description |
| ------ | ------ | ------ |
| type | string | Allow you to define the type of the index |
| name | string | Allow you to define the name of the property if different from the property name |
| dynamic | boolean | Allow you to define if the field can accept additional properties |
| analyzer | string | Allow you to define the elasticsearch analyzer |
| fields | string | Allow you to define the elasticsearch fields |
| format | string | Allow you to define the format (ie for date field) |
| enabled | boolean | Allow you to enable ou disable the field |
| null_value | string | Allow you to define the null value of the field |
| copy_to | string | Allow you to copy the field value into a group field for _search |
| relations | string | Define the releation for a join type |
| fieldClass | string | Class used to get the properties of the nested or object array type |

Additional properties are allowed, allowing you to manage other elasticsearch properties

# License
----

MIT
