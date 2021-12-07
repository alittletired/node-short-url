import redisClient, { withCache } from '../../src/components/redis'
function timoutAsync(timeoutSeconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeoutSeconds * 1000)
  })
}

function cacheString(cacheKey: string) {
  return cacheKey + 'value'
}
describe('redis withCache', () => {
  beforeEach(() => {
    jest.spyOn(global, 'setTimeout')
  })
  test('base set and get', async () => {
    const cacheFn = withCache(cacheString, (key) => key, 1)
    const cacheKey = 'cachekey'
    const value = await cacheFn(cacheKey)
    expect(value).toMatch(cacheString(cacheKey))
    const cacheValue = await redisClient.get(cacheKey)
    expect(cacheValue).not.toBeNull()
    await timoutAsync(1)
    const expiredValue = await redisClient.get(cacheKey)
    expect(expiredValue).toBeNull()
  })
})
