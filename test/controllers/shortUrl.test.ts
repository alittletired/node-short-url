import supertest from 'supertest'
import app, { initialize } from '../../src/app'
import env from '../../src/config/env'
import { closeDatabase } from '../../src/components/database'
const generateApi = () =>
  supertest(app)
    .post('/shortUrl/generate')
    .set('Content-Type', 'application/json')
const getOriginUrlApi = (shortUrl = '') =>
  supertest(app).get(`/shortUrl/getOriginUrl?shortUrl=${shortUrl}`)

beforeAll(async () => {
  env.cacheExpireTime = 10
  env.nodeEnv = 'test'
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

describe('shorturl generate', () => {
  test('invalid originUrl input return 400', async () => {
    const res = await generateApi()
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
    const res = await generateApi().send({ originUrl: 'http://originUrl/1' })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('shortUrl')
  })
})
describe('shorturl getOriginUrl', () => {
  test('invalid originUrl input return 400', async () => {
    const res = await getOriginUrlApi()
    expect(res.statusCode).toEqual(400)
    expect(res.body).toEqual(
      expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({ msg: 'shortUrl cannot be blank' }),
        ]),
      }),
    )
  })
  test('not exists ', async () => {
    const res = await getOriginUrlApi('http://originUrl')
    expect(res.statusCode).toEqual(404)
    expect(res.body).toHaveProperty('shortUrl')
  })
})
