import bodyParser from 'body-parser'
import express from 'express'
import { connectToDatabase } from './components/database'
import { connectToRedis } from './components/redis'
import * as shortUrlApi from './apis/shortUrl'
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.post('/api/shortUrl/generate', shortUrlApi.generate)
app.get('/api/shortUrl/getlongUrl', shortUrlApi.getlongUrl)
export async function initialize() {
  await Promise.all([connectToDatabase(), connectToRedis()])
}
export default app
