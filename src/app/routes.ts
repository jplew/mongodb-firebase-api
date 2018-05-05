import * as express from 'express'
import { HttpsError } from 'firebase-functions/lib/providers/https'
import { Error as MongoError, Model } from 'mongoose'
import { LocationModel, Location } from './models/location'

enum SortOrder {
  Ascending = 'asc',
  Descending = 'desc'
}

export class Routes {
  fields = 'locationName latitude longitude description'

  constructor(
    private app: express.Application,
    private placeModel: Model<LocationModel>
  ) {
    this.setRoutes()
  }

  static init(
    app: express.Application,
    placeModel: Model<LocationModel>
  ): Routes {
    return new Routes(app, placeModel)
  }

  setRoutes() {
    this.app.get('/places/:location', this.getByLocation.bind(this))
    this.app.get('/places', this.getAll.bind(this))

    this.app.post('/places/:location', this.create.bind(this))
    this.app.put('/places/:location', this.update.bind(this))
  }

  getAll(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    // if no sort parameter is provided, sort descending by default
    const { sort = SortOrder.Descending } = req.query

    this.placeModel.find(
      {},
      this.fields,
      (err: MongoError, docs: Location[]) => {
        if (err) return next(err)

        const sortedDocs: Location[] = this.sortDocs(docs, sort)

        res.locals.data = sortedDocs
        next()
      }
    )
  }

  sortDocs(docs, sort: string) {
    return docs.sort((a, b) => {
      const nameA = a['locationName'].toLowerCase()
      const nameB = b['locationName'].toLowerCase()

      if (nameA < nameB) return sort === SortOrder.Descending ? -1 : 1
      if (nameA > nameB) return sort === SortOrder.Descending ? 1 : -1
      return 0
    })
  }

  getByLocation(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const location = req.params.location

    this.placeModel.findOne(
      { locationName: location },
      this.fields,
      (err: MongoError, doc: Location) => {
        if (err) {
          return next(err)
        }
        console.log('doc is', doc)
        if (!doc) {
          console.log('did not get a response')
          next(
            new HttpsError(
              'not-found',
              `Unable to find a location by the name '${location}'.`
            )
          )
        }

        res.locals.data = doc
        next()
      }
    )
  }

  create(req: express.Request) {
    console.log('query params', req.query)

    const { latitude, longitude, locationName, description } = req.query

    const newPlace = new this.placeModel({
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

  update(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const location = req.params.location

    const { latitude, longitude, locationName, description } = req.query

    const update = {}

    if (latitude) {
      update['latitude'] = latitude
    }

    if (longitude) {
      update['longitude'] = longitude
    }

    if (locationName) {
      update['locationName'] = locationName
    }

    if (description) {
      update['description'] = description
    }

    this.placeModel.findOneAndUpdate(
      { locationName: location },
      update,
      { new: true },
      (err, doc) => {
        res.locals.data = doc
        next()
      }
    )
  }

  delete(id: number) {
    return '45'
  }
}
