import dotenv from 'dotenv'
export interface Env {
  NODE_ENV: 'development' | 'production' | 'test'
  MONGO_URL: string
  MONGO_DB_NAME: string
  REDIS_URL: string
  PORT?: string
  CACHE_EXPIRE_TIME: string
  DEFAULT_MAX_SUB_SEQ: string

  DEFAULT_SHORT_URL_SITE: string
}
dotenv.config()
const env = process.env as unknown as Env
export default env
