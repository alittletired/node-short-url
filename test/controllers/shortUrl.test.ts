import supertest from 'supertest'
import app, { initialize } from '../../src/app'
import env from '../../src/config/env'
const testApi = supertest(app)
import { closeDatabase } from '../../src/components/database'

beforeAll(async () => {
  env.cacheExpireTime = 10
  env.defaultMaxPathLength = 8
  env.defaultMaxSubSeq = 1
  env.defaultShortUrlSite = 'http://test.shorturl'
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  env.mongodbUrl = global.__MONGO_URI__
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  env.mongodbName = global.__MONGO_DB_NAME__
  await initialize()
})
afterAll(async () => {
  closeDatabase()
})

describe('generate shorturl', () => {
  test('invalid input return 400', async () => {
    const res = await testApi.post('/shortUrl')
    expect(res.statusCode).toEqual(400)
    expect(res.body).toEqual(
      expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({ msg: 'originUrl cannot be blank' }),
        ]),
      }),
    )
  })
  test('gen', async () => {
    const res = await testApi
      .post('/shortUrl')
      .set('Content-Type', 'application/json')
      .send({ originUrl: 'http://shorturl/1' })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('shortUrl')
  })
})
