import { check, validationResult } from 'express-validator'
import env from '../config/env'

import shortUrlService from '../services/shortUrl'
import asyncHandler from '../utils/asyncHandler'
/**
 * createShortUrl short url.
 * @route POST /createShortUrl
 */
export const createShortUrl = asyncHandler(async (req, res) => {
  await check('longUrl', 'longUrl cannot be blank')
    .isLength({ min: 1 })
    .run(req)
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json(errors)
  }
  const { longUrl } = req.body
  const shortUrlPath = await shortUrlService.createShortUrl(longUrl)
  return res.json({ shortUrl: `${env.baseDomain}/${shortUrlPath}` })
})

/**
 * generate short url.
 * @route get /getLongUrl?shortUrl=:shortUrl
 */
export const getLongUrl = asyncHandler(async (req, res) => {
  await check('shortUrl', 'shortUrl cannot be blank')
    .isLength({ min: 1 })
    .run(req)
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json(errors)
  }
  const shortUrl = req.query.shortUrl
  const longUrl = await shortUrlService.getLongUrl(shortUrl as string)
  if (longUrl == null) {
    return res.status(404).end()
  }
  return res.json({ longUrl })
})
