import * as JSONSchema4 from 'json-schema'

export interface ModelSchema<T> {
  bsonType: 'object'
  required?: Array<keyof T>
  properties: Record<keyof Omit<T, 'id'> | '_id', JSONSchema4.JSONSchema4>
}
export interface Model {
  id?: ObjectId
}
