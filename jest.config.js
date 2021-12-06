module.exports = {
  preset: '@shelf/jest-mongodb',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  setupFiles: ['dotenv/config'],
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: ['**/test/**/*.test.(ts|js)'],
  setupFilesAfterEnv: ['./test/jest.setup.redis-mock.js'],
}
