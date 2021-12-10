import dotenv from 'dotenv'
type NodeEnv = 'development' | 'production' | 'test'
export interface Env {
  nodeEnv: NodeEnv
  mongodbUrl: string
  mongodbName: string
  redisUrl: string
  port: number
  cacheExpireTime: number
  stepSize: number
  maxPathLength: number
  baseDomain: string
  useHashUrlShortener?: boolean
  hashCollisionRetryCount: number
}
dotenv.config({ path: `.env.${process.env.NODE_ENV}.local` })
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })
dotenv.config()

const env: Env = {
  nodeEnv: process.env.NODE_ENV,
  mongodbUrl: process.env.MONGODB_URL,
  mongodbName: process.env.MONGODB_NAME,
  redisUrl: process.env.REDIS_URL,
  baseDomain: process.env.BASE_DOMAIN,
  port: Number(process.env.PORT),
  cacheExpireTime: Number(process.env.CACHE_EXPIRE_TIME) || 3600,
  stepSize: Number(process.env.STEP_SIZE) || 1000,
  maxPathLength: Number(process.env.MAX_PATH_LENGTH) || 8,
  hashCollisionRetryCount: Number(process.env.HASH_COLLISION_RETRY_COUNT) || 3,
}
export default env
