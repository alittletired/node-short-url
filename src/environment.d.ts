declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
      MONGODB_URL: string
      MONGODB_NAME: string
      REDIS_URL: string
      PORT?: string
      CACHE_EXPIRE_TIME: string
      DEFAULT_MAX_SUB_SEQ: string
      DEFAULT_SHORT_URL_SITE: string
      DEFAULT_MAX_PATH_LENGTH: string
    }
  }
}

export {}
