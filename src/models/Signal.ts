import mongoose from 'mongoose'
export type SignalDocument = mongoose.Document & {
  id: string
  seq: number
}
const signalDocument = new mongoose.Schema<SignalDocument>(
  {
    _id: { type: String, required: true },
    seq: Number,
  },
  { timestamps: true },
)
export default mongoose.model<SignalDocument>('Signal', signalDocument)
