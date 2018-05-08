import { Schema, model } from 'mongoose'

export const placeSchema: Schema = new Schema({
  createdAt: { type: Date },
  updatedAt: { type: Date, default: Date.now },
  locationName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 50
  },
  latitude: { type: Number, required: true, min: -90, max: 90 },
  longitude: { type: Number, required: true, min: -180, max: 180 },
  description: { type: String, required: true, maxlength: 300 }
})

placeSchema.pre('save', function(next) {
  if (!this.createdAt) {
    console.log('new creation date')
    this.createdAt = new Date()
  }
  next()
})

// setId(err, places) {
// if (err) throw err

// places.sort((a, b) => a.id - b.id)

// const lastObj = places[places.length - 1]
// console.log(lastObj)

// const id = places[places.length - 1].id

// console.log('next id is:', id + 1)

// this.id = id + 1
// }
