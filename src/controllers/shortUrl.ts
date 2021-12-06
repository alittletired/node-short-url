import { Request, Response } from 'express'
import { check, validationResult } from 'express-validator'

import shortUrlService from '../services/shortUrl.service'
/**
 * generate short url.
 * @route POST /shortUrl
 */
export const postShortUrl = async (req: Request, res: Response) => {
  await check('originUrl', 'originUrl cannot be blank')
    .isLength({ min: 1 })
    .run(req)
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    // req.flash("errors", errors.array());
    //  res.statusCode(400);
    res.json(errors)
  }
  const { originUrl } = req.body
  const shortUrl = await shortUrlService.generate(originUrl)
  return res.json({ shortUrl })
}

/**
 * generate short url.
 * @route get /getOriginUrl?shortUrl=:shortUrl
 */
export const getOriginUrl = async (req: Request, res: Response) => {
  const shortUrl = req.params.shortUrl
  if (typeof shortUrl !== 'string') {
    res.status(400)
    res.json({ msg: `shortUrl  cannot be blank` })
  }
  const originUrl = await shortUrlService.generate(shortUrl)
  return res.json({ originUrl })
}
