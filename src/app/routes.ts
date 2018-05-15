import * as express from 'express'
import { HttpsError } from 'firebase-functions/lib/providers/https'
import { Error as MongoError, Model } from 'mongoose'
import { LocationModel, Location } from './models/location'

enum SortOrder {
  Ascending = 'asc',
  Descending = 'desc'
}

export class Routes {
  fields = '-_id locationName latitude longitude description'

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
    this.app.post('/places', this.create.bind(this))
    this.app.put('/places/:location', this.update.bind(this))
    this.app.delete('/places/:location', this.delete.bind(this))
  }

  getAll(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    // if no sort parameter is provided, sort descending by default (a-z)
    const { sort = SortOrder.Descending } = req.query
    const sortFlag = sort === SortOrder.Descending ? '' : '-'

    return this.placeModel
      .find({}, this.fields)
      .sort(`${sortFlag}locationName`)
      .exec((err: MongoError, docs: Location[]) => {
        if (err) {
          this.handleError(err, next)
          return
        }

        res.locals.data = docs
        next()
      })
  }

  getByLocation(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const locationName = this.getLocationName(req)

    this.placeModel.findOne(
      // doing a text search requires manual creation of a text index, but it allows text-insensitive searching and fuzzy matching. Opting for normal field match instead.
      // { $text: { $search: location } },
      { locationName },
      this.fields,
      (err: MongoError, doc: Location) => {
        if (err) {
          this.handleError(err, next)
          return
        }
        console.log('doc is', doc)
        if (!doc) {
          console.log('did not get a response')
          next(
            new HttpsError(
              'not-found',
              `Unable to find a location by the name '${locationName}'.`
            )
          )
        }

        res.locals.data = doc
        next()
      }
    )
  }

  create(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const paramsObj = this.hasBody(req.body) ? req.body : req.query

    const { latitude, longitude, description } = paramsObj

    const locationName = req.params.location || paramsObj.locationName

    const newPlace = new this.placeModel({
      latitude,
      longitude,
      locationName,
      description
    })

    return newPlace.save((err, doc) => {
      if (err) {
        this.handleError(err, next)
        return
      }

      console.log('Place saved successfully:', newPlace)
      res.locals.data = doc
      next()
    })
  }

  update(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const locationName = this.getLocationName(req)

    const paramsObj = this.hasBody(req.body) ? req.body : req.query

    this.placeModel.findOneAndUpdate(
      { locationName },
      paramsObj,
      { new: true, runValidators: true, fields: this.fields },
      (err, doc) => {
        if (err) {
          this.handleError(err, next)
          return
        }
        console.log('Document updated successfully:', doc)
        res.locals.data = doc
        next()
      }
    )
  }

  delete(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const locationName = this.getLocationName(req)

    this.placeModel.deleteOne({ locationName }, err => {
      if (err) {
        this.handleError(err, next)
        return
      }
      const message = `Document '${locationName}' deleted successfully.`
      console.log(message)
      res.locals.data = message
      next()
    })
  }

  private getLocationName(req: express.Request): string {
    // console.log('req.params', req.params) console.log(req.params.location)

    return req.params.location
      ? req.params.location
      : this.hasBody(req.body)
        ? req.body.locationName
        : req.query.locationName
  }

  private hasBody(body): boolean {
    return Object.keys(body).length > 0
  }

  private handleError(err: MongoError, next: express.NextFunction) {
    console.log('terrible errible')
    next(err)
    return
  }
}
