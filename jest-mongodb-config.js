module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: '4.0.3',
      skipMD5: true,
    },
    watchPathIgnorePatterns: ['globalConfig'],
    instance: {
      dbName: 'jest',
    },
    autoStart: false,
  },
}
