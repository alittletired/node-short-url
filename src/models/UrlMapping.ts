import { ObjectId } from 'mongodb'
export default class UrlMapping {
  constructor(
    public originUrl: string,
    public shortUrl: string,
    public id?: ObjectId,
  ) {}
}
