import { check, validationResult } from 'express-validator'

import shortUrlService from '../services/shortUrl.service'
import asyncHandler from '../utils/asyncHandler'
/**
 * generate short url.
 * @route POST /generate
 */
export const generate = asyncHandler(async (req, res) => {
  await check('originUrl', 'originUrl cannot be blank').isLength({ min: 1 }).run(req)
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json(errors)
  }
  const { originUrl } = req.body
  const shortUrl = await shortUrlService.generate(originUrl)
  return res.json({ shortUrl })
})

/**
 * generate short url.
 * @route get /getOriginUrl?shortUrl=:shortUrl
 */
export const getOriginUrl = asyncHandler(async (req, res) => {
  await check('shortUrl', 'shortUrl cannot be blank').isLength({ min: 1 }).run(req)
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json(errors)
  }
  const shortUrl = req.query.shortUrl
  const originUrl = await shortUrlService.getOriginUrl(shortUrl as string)
  return res.json({ originUrl })
})
