import * as base62 from '../utils/base62'
import { collections } from '../components/database'
import { withCache } from '../components/redis'
import { Mutex } from 'async-mutex'
import env from '../config/env'
const mutex = new Mutex()
let signalValue = -1
let subSeq = -1

async function generateNextSeq(maxSubSeq: number): Promise<number> {
  //此处采用互斥锁来处理并发场景
  if (signalValue == -1 || subSeq >= maxSubSeq - 1) {
    const release = await mutex.acquire()
    try {
      if (signalValue == -1 || subSeq >= maxSubSeq - 1) {
        const signal = await collections.Signal.findOneAndUpdate(
          { name: 'shortUrl' },
          { $inc: { value: 1 } },
          { upsert: true, returnDocument: 'after' },
        )
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        signalValue = signal.value!.value
        subSeq = -1
      }
    } finally {
      release()
    }
  }
  subSeq += 1
  return signalValue * maxSubSeq + subSeq
}

/**
 * 生成短链接网址
 * @param originUrl 原始网址
 * @returns 返回短链接网址
 */
async function generate(originUrl: string) {
  const urlMapping = await collections.UrlMapping.findOne({ originUrl })
  if (urlMapping != null) {
    return urlMapping.shortUrl
  }
  const { maxSubSeq, shortUrlSite, maxPathLength } = env
  const seq = await generateNextSeq(maxSubSeq)
  // console.log(`signalValue:${signalValue},subSeq: ${subSeq},seq: ${seq}`)
  const shortUrlPath = base62.encode(seq)
  if (shortUrlPath.length > maxPathLength) {
    throw new Error(`path length  exceed ${maxPathLength}`)
  }
  const shortUrl = `${shortUrlSite}/${shortUrlPath}`
  await collections.UrlMapping.insertOne({ originUrl, shortUrl })
  return shortUrl
}

/**
 * 获取原始网址
 * @param shortUrl 短链接网址
 * @returns 原始网址
 */
async function getOriginUrl(shortUrl: string) {
  const urlMapping = await collections.UrlMapping.findOne({ shortUrl })
  if (urlMapping === null) {
    throw new Error(`Cannot find an UrlMapping with the shortUrl: ${shortUrl}`)
  }
  return urlMapping.originUrl
}

export default {
  generate: withCache(generate, (originUrl) => `originUrl:${originUrl}`),
  getOriginUrl: withCache(getOriginUrl, (shortUrl) => `shorturl:${shortUrl}`),
}
