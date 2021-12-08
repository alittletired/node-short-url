import { MongoClient, Collection } from 'mongodb'
import env from '../config/env'
import models from '../models'
import { ModelSchma } from '../models/Model'

type UnwrapGenericParam<T> = T extends ModelSchma<infer A> ? A : never
const mongoClient: MongoClient = new MongoClient(env.mongodbUrl)
type ModelTypes = typeof models
type ModelKeys = keyof ModelTypes

type CollectionsType = {
  [m in ModelKeys]: Collection<UnwrapGenericParam<ModelTypes[m]>>
}
export const collections = {} as CollectionsType

export async function connectToDatabase(): Promise<MongoClient> {
  await mongoClient.connect()
  const db = mongoClient.db(env.mongodbName)
  // const collectionNames = await db.l
  for (const [key, modelSchema] of Object.entries(models)) {
    //todo:check db has been created
    // const collection = await db.createCollection(key)
    const collection = db.collection(key)
    const { indexes = [], bsonSchema } = modelSchema

    await db.command({
      collMod: key,
      validationAction: 'warn',
      validator: { $jsonSchema: bsonSchema },
    })

    for (const index of indexes) {
      if (Array.isArray(index)) {
        await collection.createIndex(index[0], index[1])
      } else {
        await collection.createIndex(index)
      }
    }

    Object.assign(collections, { [key]: db.collection(key) })
  }
  return mongoClient
}
export default mongoClient
