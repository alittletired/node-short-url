import { collections } from '../components/database'
import { withCache } from '../components/redis'
import { shorten as idUrlShorten } from './idUrlShortener'
import { shorten as hashUrlShorten } from './hashUrlShortener'
import env from '../config/env'
import { retry } from '../utils/retry'
const urlShorten = env.useHashUrlShortener ? hashUrlShorten : idUrlShorten
/**
 * 生成短链接
 * @param longUrl 源网址
 * @returns 返回短链接网址
 */
let createShortUrl = async (longUrl: string) => {
  const urlMapping = await collections.UrlMapping.findOne({ longUrl })
  if (urlMapping != null) {
    return urlMapping._id
  }
  const id = await urlShorten(env.maxPathLength)
  await collections.UrlMapping.insertOne({ longUrl, _id: id })
  return id
}
//使用hash会存在碰撞
if (env.useHashUrlShortener) {
  createShortUrl = retry(createShortUrl, 3)
}
/**
 * 获取源链接
 * @param shortUrl 短链接
 * @returns 源链接
 */
async function getLongUrl(shortUrl: string) {
  const urlMapping = await collections.UrlMapping.findOne({ shortUrl })
  if (urlMapping === null) {
    return null
  }
  return urlMapping.longUrl
}

export default {
  createShortUrl: withCache(createShortUrl, (longUrl) => `longUrl:${longUrl}`),
  getLongUrl: withCache(getLongUrl, (shortUrl) => `shorturl:${shortUrl}`),
}
