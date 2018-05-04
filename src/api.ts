import * as cors from 'cors'
import * as express from 'express'
import { Location } from './interfaces/Location'
import * as mongoose from 'mongoose'

import { Place } from './database/mongoose'
import { renderMiddleware } from './middleware/render'
import { errorMiddleware } from './middleware/error'

const data: Location[] = require('../assets/data.json')

enum SortOrder {
  Ascending = 'asc',
  Descending = 'desc'
}

require('dotenv').config({ path: '.env' })

export class Api {
  app: express.Application = express()

  fields = 'locationName latitude longitude description'

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
    app.get('/places/:location', this.getByLocation.bind(this))
    app.get('/places', this.list.bind(this))

    app.post('/places/:location', this.create.bind(this))
    app.put('/:id', (req, res) =>
      res.send(this.update(req.params.id, req.body))
    )
    app.delete('/:id', (req, res) => res.send(this.delete(req.params.id)))
  }

  getByLocation(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const location = req.params.location

    Place.find({ locationName: location }, this.fields, (err, doc) => {
      if (err) {
        return next(err)
      }
      res.locals.data = doc
      next()
    })
  }

  create(req: express.Request) {
    console.log('query params', req.query)

    const { latitude, longitude, locationName, description } = req.query

    const newPlace = new Place({
      latitude,
      longitude,
      locationName,
      description
    })

    newPlace.save(err => {
      if (err) throw err
      console.log('Place saved successfully!', newPlace)
    })

    return newPlace
  }

  update(id: number, body: any) {
    return '44'
  }

  delete(id: number) {
    return '45'
  }

  list(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    // if no sort parameter is provided, sort descending by default
    const { sort = SortOrder.Ascending } = req.query

    Place.find({}, this.fields, (err, docs) => {
      if (err) {
        return next(err)
      }

      docs.sort(function(a, b) {
        const nameA = a['locationName'].toLowerCase()
        const nameB = b['locationName'].toLowerCase()

        if (nameA < nameB) return sort === SortOrder.Ascending ? -1 : 1
        if (nameA > nameB) return sort === SortOrder.Ascending ? 1 : -1
        return 0
      })

      res.locals.data = docs
      next()
    })
  }
}
