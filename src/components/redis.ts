import { createClient } from 'redis'
import env from '../config/env'
const redisClient = createClient({
  url: env.redisUrl,
})

export async function connectToRedis() {
  redisClient.on('error', (err) => console.error('Redis Client Error', err))
  await redisClient.connect?.()
  console.log(`Successfully connected to redis`)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Func = (...args: any[]) => Promise<string>
type KeyFunc<T extends Func> = (...arg: Parameters<T>) => string
/**
 * 缓存的高阶函数，用于使用缓存的场景
 * @param fn
 * @param keyFn 缓存key生成器
 * @param expireTime 过期时间，如不设置默认使用站点设置的缓存失效时间
 * @returns
 */
export function withCache<T extends Func>(
  fn: T,
  keyFn: KeyFunc<T>,
  expireTime?: number,
) {
  return async function (...args: Parameters<T>) {
    const cacheKey = keyFn(...args)
    let value = await redisClient.get(cacheKey)
    if (typeof value !== 'undefined') {
      return value
    }
    value = await fn(...args)
    if (typeof value !== 'undefined') {
      await redisClient.SETEX(
        cacheKey,
        expireTime ?? env.cacheExpireTime,
        value,
      )
    }

    return value
  }
}

export default redisClient
