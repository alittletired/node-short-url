import { createClient } from 'redis'

export async function connectToRedis() {
  const client = createClient({
    url: process.env.REDIS_HOST,
  })
  client.on('error', (err) => console.error('Redis Client Error', err))
  await client.connect()
}
