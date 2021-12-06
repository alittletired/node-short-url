import * as mongodb from 'mongodb'
import env from '../config/env'
import models from '../models'
type ModelTypes = typeof models
type ModelKeys = keyof ModelTypes

type CollectionsType = {
  [m in ModelKeys]: mongodb.Collection<InstanceType<ModelTypes[m]>>
}
export const collections = {} as CollectionsType

const client = new mongodb.MongoClient(env.MONGO_URL)

export async function connectToDatabase() {
  await client.connect()
  const db = client.db(env.MONGO_DB_NAME)
  for (const [key] of Object.entries(models)) {
    const modelKey = key as ModelKeys
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    collections[modelKey] = db.collection(modelKey) as any
  }
  console.log(`Successfully connected to database`)
}
