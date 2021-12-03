import { ObjectId } from 'mongodb'
import { ModelSchema, Model } from './Model'

export default class UrlMapping implements Model {
  constructor(
    public originUrl: string,
    public shortUrl: string,
    public seq: string,
    public id?: ObjectId,
  ) {}
}
export const UrlMappingSchema: ModelSchema<UrlMapping> = {
  bsonType: 'object',
  required: ['originUrl', 'shortUrl'],
  properties: {
    _id: {},
    seq: {
      bsonType: 'number',
      description: "'seq' is required and is a string",
    },
    originUrl: {
      bsonType: 'string',
      description: "'originUrl' is required and is a string",
    },
    shortUrl: {
      bsonType: 'string',
      description: "'shortUrl' is required and is a string",
    },
  },
}
