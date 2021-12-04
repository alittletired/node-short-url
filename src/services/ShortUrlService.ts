import { withCache } from '../components/redisClient'
import UrlMapping from '../models/UrlMapping'
import Signal from '../models/Signal'
import env from '../config/env'
import * as base62 from '../utils/base62'
const MAX_SUB_SEQ = Number(env.MAX_SUB_SEQ)
let shortUrlSeq = -1
let subSeq = -1

/**
 * 自增获取下一个序列,
 */
async function acquireNextSeq() {
  const signal = await Signal.findByIdAndUpdate(
    'shortUrl',
    { $inc: { seq: 1 } },
    { new: true, upsert: true, rawResult: true },
  )
  if (signal.value == null) {
    throw new Error('Cannot find an Signal with the _id: "shortUrl"')
  }
  return signal.value.seq
}

/**
 * 生成短链接网址
 * @param originUrl 原始网址
 * @returns 返回短链接网址
 */
async function generate(originUrl: string) {
  const urlMapping = await UrlMapping.findOne({ originUrl })
  if (urlMapping != null) {
    return urlMapping.shortUrl
  }

  if (shortUrlSeq == -1 || subSeq >= MAX_SUB_SEQ - 1) {
    shortUrlSeq = await acquireNextSeq()
    subSeq = -1
  }
  subSeq += 1
  const seq = shortUrlSeq * MAX_SUB_SEQ + subSeq
  const shortUrl = base62.encode(seq)
  await UrlMapping.create({ originUrl, shortUrl, seq })
  return shortUrl
}

/**
 * 获取原始网址
 * @param shortUrl 短链接网址
 * @returns 原始网址
 */
async function getOriginUrl(shortUrl: string) {
  const urlMapping = await UrlMapping.findOne({ shortUrl })
  if (!urlMapping) {
    throw new Error(`Cannot find an UrlMapping with the shortUrl: ${shortUrl}`)
  }
  return urlMapping.shortUrl
}

export default {
  generate: withCache(generate, (originUrl) => `originUrl:${originUrl}`),
  getOriginUrl: withCache(getOriginUrl, (shortUrl) => `shorturl:${shortUrl}`),
}
