import * as cors from 'cors'
import * as express from 'express'
import * as mongoose from 'mongoose'
import { errorMiddleware } from './middleware/error'
import { renderMiddleware } from './middleware/render'
import { LocationModel } from './models/location'
import { IModel } from './models/model'
import { Routes } from './routes'
import { placeSchema } from './schemas/schemas'

require('dotenv').config({ path: '.env' })

export class Api {
  app: express.Application = express()

  constructor() {
    this.config(this.app)
  }

  static bootstrap(): Api {
    return new Api()
  }

  config(app: express.Application) {
    app.use(cors({ origin: true }))

    const connection: mongoose.Connection = mongoose.createConnection(
      process.env.MONGO_URI
    )

    const placeModel = connection.model<LocationModel>('Place', placeSchema)

    Routes.init(app, placeModel)

    app.use(renderMiddleware)
    app.use(errorMiddleware)
  }
}
