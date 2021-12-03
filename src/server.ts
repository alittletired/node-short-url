import express from 'express'
import { connectToDatabase } from './components/database'

const app = express()
const port = 3000
connectToDatabase()
  .then(() => {
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
