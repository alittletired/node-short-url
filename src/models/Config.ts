import mongoose from 'mongoose'
export type ConfigDocument = mongoose.Document & {
  key: string
  value: string
}
const configDocument = new mongoose.Schema<ConfigDocument>(
  {
    key: String,
    value: String,
  },
  { timestamps: true },
)
export default mongoose.model<ConfigDocument>('Config', configDocument)
