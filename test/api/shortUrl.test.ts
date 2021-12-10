import supertest from 'supertest'
import app, { initialize } from '../../src/app'
import redisClient from '../../src/components/redis'
import mongoClient, { collections } from '../../src/components/database'
const generateApi = (originUrl?: string) =>
  supertest(app)
    .post('/api/shortUrl/generate')
    .set('Content-Type', 'application/json')
    .send({ originUrl })

const getOriginUrlApi = (shortUrl?: string) =>
  supertest(app).get(`/api/shortUrl/getOriginUrl?shortUrl=${shortUrl}`)

const generatedDataPromise = async (idx: number, repeat = 20) => {
  const promise = [...Array(repeat).keys()].map((key) =>
    generateApi(`http://originUrl/concurrent_${idx}_${key}`),
  )
  const allRes = await Promise.all(promise)
  for (const res of allRes) {
    expect(res.body.shortUrl).not.toBeNull()
  }
}

beforeAll(async () => {
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
  test('same url only generate one', async () => {
    const originUrl = `http://originUrl/1`
    const res = await generateApi(originUrl)
    const { shortUrl } = res.body
    expect(shortUrl).not.toBeNull()
    redisClient.flushDb()
    const res1 = await generateApi(originUrl)
    expect(res1.body.shortUrl).toEqual(shortUrl)
  })
  test('concurrent  generate', async () => {
    await generatedDataPromise(1)
  })
  test('exceed max length should return statusCode 500', async () => {
    collections.Signal.findOneAndUpdate(
      { name: 'shortUrl' },
      { $inc: { value: 300000 } },
    )
    const res = await generateApi(`http://originUrl/maxlength`)
    expect(res.statusCode).toEqual(500)
  })
})
describe('shorturl getOriginUrl', () => {
  test('invalid shortUrl input should return statusCode 400', async () => {
    const res = await getOriginUrlApi('')
    expect(res.statusCode).toEqual(400)
  })
  test('not exists shortUrl should return statusCode 404', async () => {
    const res = await getOriginUrlApi('http://originUrl/not-exists')
    expect(res.statusCode).toEqual(404)
  })

  test('generate and getOriginUrl ', async () => {
    const originUrl = `http://originUrl/generate-and-getOriginUrl`
    const res = await generateApi(originUrl)
    const { shortUrl } = res.body
    const res1 = await getOriginUrlApi(shortUrl)
    expect(res1.body.originUrl).toEqual(originUrl)
  })
})
