import { Model } from 'mongoose'
import { LocationModel } from './location'

export interface IModel {
  place: Model<LocationModel>
}
