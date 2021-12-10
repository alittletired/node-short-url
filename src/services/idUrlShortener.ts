import { Mutex } from 'async-mutex'
import * as base62 from '../utils/base62'
import { collections } from '../components/database'
import env from '../config/env'
export type UrlShorten = (len: number) => Promise<string>
let signalValue = -1
let currStep = -1
const mutex = new Mutex()
const stepSize = env.stepSize
const shorten: UrlShorten = async (len) => {
  if (signalValue == -1 || currStep >= stepSize - 1) {
    const release = await mutex.acquire()
    try {
      if (signalValue == -1 || currStep >= stepSize - 1) {
        const signal = await collections.Signal.findOneAndUpdate(
          { name: 'urlShortener' },
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
  const seq = signalValue + currStep
  const shortUrlPath = base62.encode(seq)
  if (shortUrlPath.length > len) {
    throw new Error(`path length exceed ${len}`)
  }
  return shortUrlPath
}

export { shorten }
