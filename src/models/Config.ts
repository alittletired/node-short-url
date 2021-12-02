import { ObjectId } from 'mongodb'
import { ModelSchema, Model } from './Model'

export default class Config implements Model {
  constructor(public key: string, public value: string, public id?: ObjectId) {}
}
export const ConfigSchema: ModelSchema<Config> = {
  bsonType: 'object',
  required: ['key', 'value'],
  properties: {
    _id: {},
    key: {
      bsonType: 'string',
      description: "'key' is required and is a string",
    },
    value: {
      bsonType: 'string',
      description: "'value' is required and is a string",
    },
  },
}
