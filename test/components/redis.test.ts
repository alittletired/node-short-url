import redisClient, { withCache } from '../../src/components/redis'
function timoutAsync(timeoutSeconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeoutSeconds * 1000)
  })
}

function cacheString(cacheKey: string) {
  return cacheKey + 'value'
}
describe('withCache', () => {
  beforeEach(() => {
    jest.spyOn(global, 'setTimeout')
  })
  test('base set and get', async () => {
    const cacheFn = withCache(cacheString, (key) => key)
    const cacheKey = 'cachekey'
    const value = await cacheFn(cacheKey)
    expect(value).toMatch(cacheString(cacheKey))
  })
  test('expire key after 1 second', async () => {
    const cacheFn = withCache(cacheString, (key) => key, 1)
    const expireKey = 'expirekey'
    const value = await cacheFn(expireKey)
    expect(value).toMatch(cacheString(expireKey))
    await timoutAsync(1)
    const expiredValue = await redisClient.get(expireKey)
    expect(expiredValue).toBeNull()
  })
})
