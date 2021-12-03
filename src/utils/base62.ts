const CHARSET =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const CHARSET_LEN = CHARSET.length

export function encode(num: number) {
  if (num === 0) {
    return CHARSET[0]
  }
  let res = ''
  while (num > 0) {
    res = CHARSET[num % CHARSET_LEN] + res
    num = Math.floor(num / CHARSET_LEN)
  }
  return res
}
