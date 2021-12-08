import { Model, ModelSchma } from './Model'
interface Signal extends Model {
  seq: number
  name: string
}
const signalSchma: ModelSchma<Signal> = {
  bsonSchema: {
    type: 'object',
    // required: ['seq', 'name'],
    additionalProperties: false,
    properties: {
      _id: { bsonType: 'objectId' },
      seq: {
        type: 'number',
        description: "'seq' is required and is a number",
      },
      name: {
        type: 'string',
        description: "'name' is required and is a string",
      },
    },
  },
}
export default signalSchma
