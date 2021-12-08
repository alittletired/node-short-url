import { Model, ModelSchma } from './Model'

interface UrlMapping extends Model {
  originUrl: string
  shortUrl: string
}
const urlMappingSchma: ModelSchma<UrlMapping> = {
  indexes: [{ originUrl: 1 }, [{ shortUrl: 1 }, { unique: true }]],
  bsonSchema: {
    type: 'object',
    required: ['originUrl', 'shortUrl'],
    additionalProperties: false,
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
  },
}
export default urlMappingSchma
