declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production'
      MONGO_DB_CONN_STRING: string
      MONGO_DB_NAME: string
    }
  }
}

export {}
