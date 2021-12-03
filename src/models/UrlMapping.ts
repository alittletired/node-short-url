import mongoose from 'mongoose'
export type UrlMappingDocument = mongoose.Document & {
  originUrl: string
  shortUrl: string
  seq: number
}
const urlMappingDocument = new mongoose.Schema<UrlMappingDocument>(
  {
    originUrl: String,
    shortUrl: String,
    seq: Number,
  },
  { timestamps: true },
)
export default mongoose.model<UrlMappingDocument>(
  'UrlMapping',
  urlMappingDocument,
)
