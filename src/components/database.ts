import dotenv from 'dotenv'
import * as mongoDB from 'mongodb'
import models, { modelSchema } from '../models'

type ModelNames = keyof typeof models
export const collections = {} as Record<ModelNames, mongoDB.Collection>
export async function connectToDatabase() {
  dotenv.config()
  const client = new mongoDB.MongoClient(process.env.MONGO_DB_CONN_STRING)
  await client.connect()
  const db = client.db(process.env.MONGO_DB_NAME)
  for (const [modelName] of Object.entries(models)) {
    await db.command({
      collMod: modelName,
      validator: modelSchema[modelName as ModelNames],
    })
    collections[modelName as ModelNames] = await db.createCollection(modelName)
  }
  console.log(`Successfully connected to database: ${db.databaseName}`)
}
export default collections
