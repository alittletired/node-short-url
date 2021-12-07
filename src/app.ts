import bodyParser from 'body-parser'
import express from 'express'
import { connectToDatabase } from './components/database'
import { connectToRedis } from './components/redis'
import env from './config/env'
import { initializeConfig } from './services/config.service'
import * as shortUrlController from './controllers/shortUrl'
const app = express()
app.set('port', env.port)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.post('/shortUrl/generate', shortUrlController.generate)
app.get('/shortUrl/getOriginUrl', shortUrlController.getOriginUrl)
export async function initialize() {
  await Promise.all([
    connectToDatabase(env.mongodbUrl, env.mongodbName),
    connectToRedis(),
  ])
  await initializeConfig()
}
export default app
