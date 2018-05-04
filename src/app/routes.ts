import * as express from 'express'
import { Place } from './database/mongoose'

enum SortOrder {
  Ascending = 'asc',
  Descending = 'desc'
}

export class Routes {
  fields = 'locationName latitude longitude description'

  list(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    // if no sort parameter is provided, sort descending by default
    const { sort = SortOrder.Descending } = req.query

    Place.find({}, this.fields, (err, docs) => {
      if (err) {
        return next(err)
      }

      docs.sort(function(a, b) {
        const nameA = a['locationName'].toLowerCase()
        const nameB = b['locationName'].toLowerCase()

        if (nameA < nameB) return sort === SortOrder.Descending ? -1 : 1
        if (nameA > nameB) return sort === SortOrder.Descending ? 1 : -1
        return 0
      })

      res.locals.data = docs
      next()
    })
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
}
