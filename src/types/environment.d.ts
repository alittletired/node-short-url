declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production'
      MONGO_URL: string
      REDIS_URL: string
      PORT: string
      MAX_SUB_SEQ: string
      DEFAULT_EXPIRE_TIME: string
    }
  }
}

export {}
