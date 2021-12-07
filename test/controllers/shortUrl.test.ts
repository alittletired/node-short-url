import supertest from 'supertest'
import app, { initialize } from '../../src/app'
import mongoClient from '../../src/components/database'
const generateApi = () =>
  supertest(app).post('/shortUrl/generate').set('Content-Type', 'application/json')
const getOriginUrlApi = (shortUrl = '') =>
  supertest(app).get(`/shortUrl/getOriginUrl?shortUrl=${shortUrl}`)

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
  test('generate url', async () => {
    for (let i = 1; i < 10; i++) {
      const res = await generateApi().send({ originUrl: `http://originUrl/${i}` })
      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('shortUrl')
    }
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
    expect(res.statusCode).toEqual(500)
    // expect(res.body).toHaveProperty('shortUrl')
  })
  test('getOriginUrl with cache ', async () => {
    // const res = await getOriginUrlApi('http://originUrl/1')
    // expect(res.statusCode).toEqual(200)
    // expect(res.body).toHaveProperty('shortUrl')
  })
})
