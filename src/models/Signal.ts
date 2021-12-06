import { ObjectId } from 'mongodb'
export default class Signal {
  constructor(public seq: number, public id?: ObjectId) {}
}
