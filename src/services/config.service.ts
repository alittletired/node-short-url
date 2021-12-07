import env from '../config/env'
import { collections } from '../components/database'
import Config from '../models/Config'
let config = null as unknown as Config
export async function getConfig() {
  if (config != null) return config
  const configOrNull = await collections.Config.findOne({ env: env.nodeEnv })
  if (configOrNull == null) {
    throw new Error(`Cannot find an Config with the env: "${env.nodeEnv}"`)
  }
  config = configOrNull
  return config
}
/**
 * 初始化配置类
 * @param env
 */
export async function initializeConfig() {
  const configOrNull = await collections.Config.findOne({ env: env.nodeEnv })
  if (configOrNull != null) {
    return
  }

  await collections.Config.insertOne({
    env: env.nodeEnv,
    maxSubSeq: env.defaultMaxSubSeq,
    shortUrlSite: env.defaultShortUrlSite,
    maxPathLength: env.defaultMaxPathLength,
  })
}
export default { getConfig, initializeConfig }
