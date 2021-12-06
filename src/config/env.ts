import dotenv from 'dotenv'
export interface Env {
  nodeEnv: 'development' | 'production' | 'test'
  mongodbUrl: string
  mongodbName: string
  redisUrl: string
  port: number
  cacheExpireTime: number
  defaultMaxSubSeq: number
  defaultShortUrlSite: string
  defaultMaxPathLength: number
}
dotenv.config()
const env: Env = {
  nodeEnv: process.env.NODE_ENV,
  mongodbUrl: process.env.MONGODB_URL,
  mongodbName: process.env.MONGODB_NAME,
  redisUrl: process.env.REDIS_URL,
  port: Number(process.env.PORT) || 3000,
  cacheExpireTime: Number(process.env.CACHE_EXPIRE_TIME) || 86400,
  defaultMaxSubSeq: Number(process.env.DEFAULT_MAX_SUB_SEQ) || 200,
  defaultShortUrlSite: process.env.DEFAULT_SHORT_URL_SITE,
  defaultMaxPathLength: Number(process.env.DEFAULT_MAX_PATH_LENGTH) || 8,
}
export default env
