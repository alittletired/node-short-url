import * as base62 from '../utils/base62'
import { collections } from '../components/database'
import { withCache } from '../components/redis'
import { Mutex } from 'async-mutex'
import env from '../config/env'
const mutex = new Mutex()
let signalValue = -1
let currStep = -1

async function generateNextSeq(stepSize: number): Promise<number> {
  if (signalValue == -1 || currStep >= stepSize - 1) {
    const release = await mutex.acquire()
    try {
      if (signalValue == -1 || currStep >= stepSize - 1) {
        const signal = await collections.Signal.findOneAndUpdate(
          { name: 'shortUrl' },
          { $inc: { value: stepSize } },
          { upsert: true, returnDocument: 'after' },
        )
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        signalValue = signal.value!.value - stepSize
        currStep = -1
      }
    } finally {
      release()
    }
  }
  currStep += 1
  return signalValue * stepSize + currStep
}

/**
 * 生成短链接
 * @param originUrl 源网址
 * @returns 返回短链接网址
 */
async function generate(originUrl: string) {
  //todo: 此处可以通过bloom filter判断源路径是否存在，如果不存在再进行查库
  const urlMapping = await collections.UrlMapping.findOne({ originUrl })
  if (urlMapping != null) {
    return urlMapping.shortUrl
  }
  const { stepSize, shortUrlSite, maxPathLength } = env
  const seq = await generateNextSeq(stepSize)
  const shortUrlPath = base62.encode(seq)
  if (shortUrlPath.length > maxPathLength) {
    throw new Error(`path length exceed ${maxPathLength}`)
  }
  const shortUrl = `${shortUrlSite}/${shortUrlPath}`
  await collections.UrlMapping.insertOne({ originUrl, shortUrl })
  return shortUrl
}

/**
 * 获取源链接
 * @param shortUrl 短链接
 * @returns 源链接
 */
async function getOriginUrl(shortUrl: string) {
  //todo: 此处可以通过bloom filter判断短链接是否存在，如果不存在直接返回null
  const urlMapping = await collections.UrlMapping.findOne({ shortUrl })
  if (urlMapping === null) {
    return null
  }
  return urlMapping.originUrl
}

export default {
  generate: withCache(generate, (originUrl) => `originUrl:${originUrl}`),
  getOriginUrl: withCache(getOriginUrl, (shortUrl) => `shorturl:${shortUrl}`),
}
