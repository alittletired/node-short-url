import { MongoClient, Collection } from 'mongodb'
import models from '../models'
let mongoClient: MongoClient

type ModelTypes = typeof models
type ModelKeys = keyof ModelTypes

type CollectionsType = {
  [m in ModelKeys]: Collection<InstanceType<ModelTypes[m]>>
}
export const collections = {} as CollectionsType

export async function connectToDatabase(
  mongodbUrl: string,
  mongodbName: string,
): Promise<MongoClient> {
  mongoClient = await MongoClient.connect(mongodbUrl)
  const db = mongoClient.db(mongodbName)
  for (const key of Object.keys(models)) {
    Object.assign(collections, { [key]: db.collection(key) })
  }

  console.log(`Successfully connected to database`)
  return mongoClient
}
export async function closeDatabase() {
  await mongoClient?.close()
}
