declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production'
      MONGO_DB_CONN_STRING: string
      REDIS_URL: string
      PORT: string
    }
  }
}

export {}
