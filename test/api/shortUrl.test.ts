import supertest from 'supertest'
import app, { initialize } from '../../src/app'
import redisClient from '../../src/components/redis'
import mongoClient from '../../src/components/database'
import env from '../../src/config/env'
const generateApi = (originUrl?: string) =>
  supertest(app)
    .post('/api/shortUrl/generate')
    .set('Content-Type', 'application/json')
    .send({ originUrl })
const getOriginUrlApi = (shortUrl = '') =>
  supertest(app).get(`/api/shortUrl/getOriginUrl?shortUrl=${shortUrl}`)

const generatedDataPromise = async (idx: number) => {
  const promise = [...Array(20).keys()].map((key) =>
    generateApi(`http://originUrl/concurrent_${idx}_${key}`),
  )
  const allRes = await Promise.all(promise)
  for (const res of allRes) {
    expect(res.body.shortUrl).not.toBeNull()
  }
}

beforeAll(async () => {
  await mongoClient.connect()
  await mongoClient.db(env.mongodbName).createCollection('UrlMapping')
  await initialize()
})
afterAll(async () => {
  mongoClient?.close()
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
  test('base generate url', async () => {
    const res = await generateApi(`http://originUrl/1`)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('shortUrl')
  })
  test('same url  generate same short url', async () => {
    const originUrl = `http://originUrl/1`
    const res = await generateApi(originUrl)
    const { shortUrl } = res.body
    expect(shortUrl).not.toBeNull()
    redisClient.flushDb()
    const res1 = await generateApi(originUrl)
    expect(res1.body.shortUrl).toEqual(shortUrl)
  })
  test('concurrent  generate 1', async () => {
    await generatedDataPromise(1)
  })
  test('exceed max length return statusCode 500', async () => {
    const { maxSubSeq } = env
    env.maxSubSeq = 2000000
    const res = await generateApi(`http://originUrl/maxlength`)
    env.maxSubSeq = maxSubSeq
    expect(res.statusCode).toEqual(500)
  })
})
describe('shorturl getOriginUrl', () => {
  test('invalid shortUrl input return statusCode 400', async () => {
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
  test('shortUrl not exists return statusCode 500', async () => {
    const res = await getOriginUrlApi('http://originUrl')
    expect(res.statusCode).toEqual(500)
    // expect(res.body).toHaveProperty('shortUrl')
  })
  test('getOriginUrl ', async () => {
    const originUrl = `http://originUrl/with-cache`
    const res = await generateApi(originUrl)
    const { shortUrl } = res.body
    const res1 = await getOriginUrlApi(shortUrl)
    expect(res1.statusCode).toEqual(200)
    expect(res1.body.originUrl).toEqual(originUrl)
    await redisClient.flushDb()
    const res2 = await getOriginUrlApi(shortUrl)
    expect(res2.statusCode).toEqual(200)
    expect(res2.body.originUrl).toEqual(originUrl)
  })
})
