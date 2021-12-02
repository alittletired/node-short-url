import { ObjectId } from 'mongodb'
import { ModelSchema, Model } from './Model'

export default class ShortUrl implements Model {
  constructor(public originUrl: string, public shortUrl: string, public id?: ObjectId) {}
}
export const ShortUrlSchema: ModelSchema<ShortUrl> = {
  bsonType: 'object',
  required: ['originUrl', 'shortUrl'],
  properties: {
    _id: {},
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
