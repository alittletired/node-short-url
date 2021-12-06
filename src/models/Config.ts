import { ObjectId } from 'mongodb'
export default class Config {
  constructor(
    public env: string,
    public maxSubSeq: number,
    public maxPathLength: string,
    public shortUrlSite: string,
    public id?: ObjectId,
  ) {}
}
