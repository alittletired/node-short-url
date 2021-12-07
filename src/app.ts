import bodyParser from 'body-parser'
import express from 'express'
import { connectToDatabase } from './components/database'
import { connectToRedis } from './components/redis'
import * as shortUrlController from './controllers/shortUrl'
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.post('/shortUrl/generate', shortUrlController.generate)
app.get('/shortUrl/getOriginUrl', shortUrlController.getOriginUrl)
export async function initialize() {
  await Promise.all([connectToDatabase(), connectToRedis()])
}
export default app
