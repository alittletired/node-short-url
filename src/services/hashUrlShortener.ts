import { nanoid } from 'nanoid'
import { UrlShorten } from './idUrlShortener'

const shorten: UrlShorten = async (len) => {
  return await nanoid(len)
}
export { shorten }
