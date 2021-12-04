import { createClient } from 'redis'
import env from '../config/env'

const DEFAULT_EXPIRE_TIME = Number(env.DEFAULT_EXPIRE_TIME)

const redisClient = createClient({
  url: env.REDIS_HOST,
})

export async function connectToRedis() {
  redisClient.on('error', (err) => console.error('Redis Client Error', err))
  await redisClient.connect()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Func = (...args: any[]) => Promise<string>

/**
 * 缓存的高阶函数，用于使用缓存的场景
 * @param fn
 * @param keyFn 缓存key生成器
 * @param expireTime 过期时间，如不设置默认使用环境变量DEFAULT_EXPIRE_TIME
 * @returns
 */
export function withCache<T extends Func>(
  fn: T,
  keyFn: (...arg: Parameters<T>) => string,
  expireTime = 0,
) {
  return async function (...args: Parameters<T>) {
    const cacheKey = keyFn(...args)
    let value = await redisClient.get(cacheKey)
    if (typeof value !== 'undefined') {
      return value
    }
    value = await fn(...args)
    if (typeof value !== 'undefined')
      await redisClient.setEx(cacheKey, expireTime || DEFAULT_EXPIRE_TIME, value)
    return value
  }
}

export default redisClient
