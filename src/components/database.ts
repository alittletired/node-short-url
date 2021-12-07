import { MongoClient, Collection } from 'mongodb'
import env from '../config/env'
import models from '../models'

const mongoClient: MongoClient = new MongoClient(env.mongodbUrl)
type ModelTypes = typeof models
type ModelKeys = keyof ModelTypes

type CollectionsType = {
  [m in ModelKeys]: Collection<InstanceType<ModelTypes[m]>>
}
export const collections = {} as CollectionsType

export async function connectToDatabase(): Promise<MongoClient> {
  await mongoClient.connect()
  const db = mongoClient.db(env.mongodbName)
  for (const key of Object.keys(models)) {
    Object.assign(collections, { [key]: db.collection(key) })
  }

  console.log(`Successfully connected to database`)
  return mongoClient
}
export default mongoClient
