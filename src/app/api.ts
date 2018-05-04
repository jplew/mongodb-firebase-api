import * as cors from 'cors'
import * as express from 'express'
import { Location } from './interfaces/Location'
import * as mongoose from 'mongoose'

import { Routes } from './routes'
import { Place } from './database/mongoose'
import { renderMiddleware } from './middleware/render'
import { errorMiddleware } from './middleware/error'
require('dotenv').config({ path: '.env' })

export class Api {
  app: express.Application = express()

  routeService: Routes = new Routes()

  constructor() {
    this.initApp(this.app)
  }

  static bootstrap(): Api {
    return new Api()
  }

  initApp(app: express.Application) {
    mongoose.connect(process.env.MONGO_URI)

    app.use(cors({ origin: true }))

    this.setRoutes(app)

    app.use(renderMiddleware)
    app.use(errorMiddleware)
  }

  setRoutes(app: express.Application) {
    app.get('/places/:location', this.routeService.getByLocation)
    app.get('/places', this.routeService.list.bind(this.routeService))

    app.post('/places/:location', this.routeService.create.bind(this))
    app.put('/:id', (req, res) =>
      res.send(this.routeService.update(req.params.id, req.body))
    )
    app.delete('/:id', (req, res) =>
      res.send(this.routeService.delete(req.params.id))
    )
  }
}
