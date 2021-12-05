import bodyParser from 'body-parser'
import express from 'express'
import { connectToDatabase } from './components/database'
import { connectToRedis } from './components/redisClient'
import env from './config/env'
const app = express()
app.set('port', env.PORT || 3000)
app.use(bodyParser.json())
app.get('/', (req, res) => {
  res.send('Hello World!')
})
Promise.all([connectToDatabase, connectToRedis])
export default app
