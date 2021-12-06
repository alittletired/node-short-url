import env from '../config/env'
import { collections } from '../components/database'
import Config from '../models/Config'
let config = null as unknown as Config
export async function getConfig() {
  if (config != null) return config
  const configOrNull = await collections.Config.findOne({ env: env.NODE_ENV })
  if (configOrNull == null) {
    throw new Error(`Cannot find an Config with the env: "${env.NODE_ENV}"`)
  }
  config = configOrNull
  return config
}
/**
 * 初始化配置类
 * @param env
 */
export async function initializeConfig() {
  const configOrNull = await collections.Config.findOne({ env: env.NODE_ENV })
  if (configOrNull != null) {
    return
  }
  console.warn({
    env: env.NODE_ENV,
    maxSubSeq: env.DEFAULT_MAX_SUB_SEQ,
    shortUrlSite: env.DEFAULT_SHORT_URL_SITE,
  })

  await collections.Config.insertOne({
    env: env.NODE_ENV,
    maxSubSeq: parseInt(env.DEFAULT_MAX_SUB_SEQ),
    shortUrlSite: env.DEFAULT_SHORT_URL_SITE,
    maxPathLength: env.DEFAULT_MAX_SUB_SEQ,
  })
}
export default { getConfig, initializeConfig }
