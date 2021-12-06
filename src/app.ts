import bodyParser from 'body-parser'
import express from 'express'
import { connectToDatabase } from './components/database'
import { connectToRedis } from './components/redis'
import env from './config/env'
import { initializeConfig } from './services/config.service'
import * as shortUrlController from './controllers/shortUrl'
const app = express()
app.set('port', env.PORT || 3000)
app.use(bodyParser.json())
app.post('/shortUrl', shortUrlController.postShortUrl)

export async function initialize() {
  await Promise.all([connectToDatabase(), connectToRedis()])
  await initializeConfig()
}
export default app
