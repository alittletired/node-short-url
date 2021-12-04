import bodyParser from 'body-parser'
import express from 'express'
import { connectToDatabase } from './components/database'
import { connectToRedis } from './components/redisClient'
import env from './config/env'
const app = express()
const port = env.PORT || 3000
Promise.all([connectToDatabase, connectToRedis])
  .then(() => {
    app.use(bodyParser.json())
    app.get('/', (req, res) => {
      res.send('Hello World!')
    })

    app.listen(port, () => {
      // eslint-disable-next-line
      console.log(`Example app listening at http://localhost:${port}`)
    })
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
