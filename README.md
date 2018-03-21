# Es Mapping Ts

#### This library is used to generate elasticsearch mapping through typescript decorator

## Installation

```sh
npm install es-mapping-ts --save
````

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

/!\ The nested class must be an @EsEntity

# License
----

MIT
