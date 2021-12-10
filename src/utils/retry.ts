/**
 * 重试的高阶函数
 * @param fn
 * @param retryCount 重试次数
 * @returns
 */
export function retry<T extends Func>(fn: T, retryCount: number) {
  return async function (...args: Parameters<T>) {
    for (let i = 0; i < retryCount; i++) {
      try {
        return await fn(...args)
      } catch (e) {}
    }
    return await fn(...args)
  }
}
