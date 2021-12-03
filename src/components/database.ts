import mongoose from 'mongoose'

export async function connectToDatabase() {
  await mongoose.connect(process.env.MONGO_DB_CONN_STRING)
  console.log(`Successfully connected to database`)
}
