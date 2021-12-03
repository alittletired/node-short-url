import Config, { ConfigSchema } from './Config'
import { ModelSchema } from './Model'
import UrlMapping, { UrlMappingSchema } from './UrlMapping'
const models = {
  Config,
  UrlMapping,
}

type Models = typeof models
type ModelSchemas = {
  [M in keyof Models]: ModelSchema<InstanceType<Models[M]>>
}

export const modelSchema: ModelSchemas = {
  Config: ConfigSchema,
  UrlMapping: UrlMappingSchema,
}

export default models
