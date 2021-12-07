//@ts-check

jest.mock('redis', () => {
  /**
   * redis-mock已经一年多没有维护，目前不支持promise，不支持connect
   * 方法setex也和redis（setEx）不同，通过mock redis-mock模块来支撑
   *  */

  const redisMock = jest.requireActual('redis-mock')
  const { createClient } = redisMock

  const mockCreateClient = () => {
    const client = createClient()
    const { get: oldGet, setex } = client
    const connect = () => Promise.resolve()
    function get(key) {
      return new Promise((reslove) => {
        const value = client._selectedDb.get(key)
        reslove(value ?? null)
      })
    }

    function setEx(key, expireTime, value) {
      return new Promise((reslove) => {
        setex.apply(client, [key, expireTime, value, reslove])
      })
    }

    Object.assign(client, {
      connect,
      get,
      setEx,
    })
    return client
  }

  return {
    __esModule: true,
    ...redisMock,
    createClient: mockCreateClient,
  }
})
