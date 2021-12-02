import Config, { ConfigSchema } from './Config'
import { ModelSchema } from './Model'
import ShortUrl, { ShortUrlSchema } from './ShortUrl'
const models = {
  Config,
  ShortUrl,
}
export default models

type Models = typeof models
export const modelSchema: { [M in keyof Models]: ModelSchema<InstanceType<Models[M]>> } =
  {
    Config: ConfigSchema,
    ShortUrl: ShortUrlSchema,
  }
