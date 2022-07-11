import * as express from "express";
import { CallbackError, Error as MongoError, Model } from "mongoose";
import { LocationModel, Location } from "./models/location";

enum SortOrder {
  Ascending = "asc",
  Descending = "desc",
}

export class Routes {
  fields = "-_id locationName latitude longitude description";

  constructor(
    private app: express.Application,
    private placeModel: Model<LocationModel>
  ) {
    this.setRoutes();
  }

  static init(app: express.Application, placeModel: Model<any>): Routes {
    return new Routes(app, placeModel);
  }

  setRoutes() {
    this.app.get("/places/:location", this.getByLocation.bind(this));
    this.app.get("/places", this.getAll.bind(this));
    this.app.post("/places/:location", this.create.bind(this));
    this.app.post("/places", this.create.bind(this));
    this.app.put("/places/:location", this.update.bind(this));
    this.app.delete("/places/:location", this.delete.bind(this));
  }

  async getAll(
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
  ) {
    // if no sort parameter is provided, sort descending by default (a-z)
    const { sort = SortOrder.Descending } = req.query;
    const sortFlag = sort === SortOrder.Descending ? "" : "-";

    return this.placeModel
        .find({}, this.fields)
        .sort(`${sortFlag}locationName`)
        .exec((err: MongoError, docs: Location[]) => {
          console.log({ docs });
          if (err) {
            this.handleError(err, next);
            return;
          }

          res.locals.data = docs;
          next();
        });
  }

  async getByLocation(
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
  ) {
    const query = this.getLocationName(req);

    this.placeModel.find(
        {
          $or: [
            { locationName: new RegExp(query, "i") },
            { description: new RegExp(query, "i") },
          ],
        },
        this.fields,
        null,
        (err: CallbackError, doc: any) => {
          if (err) {
            this.handleError(err, next);
            return;
          }
          console.log("doc is", doc);
          if (!doc) {
            console.log("did not get a response");
            next(
                new Error( `Unable to find a location by the name '${query}'.`)
            );
          }

          res.locals.data = doc;
          next();
        }
    );
  }

  create(
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
  ) {
    const paramsObj = this.hasBody(req.body) ? req.body : req.query;

    const { latitude, longitude, description } = paramsObj;

    const locationName = req.params.location || paramsObj.locationName;

    const NewPlace = new this.placeModel({
      latitude,
      longitude,
      locationName,
      description,
    });

    return NewPlace.save((err: any, doc: any) => {
      if (err) {
        this.handleError(err, next);
        return;
      }

      console.log("Place saved successfully:", NewPlace);
      res.locals.data = doc;
      next();
    });
  }

  update(
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
  ) {
    const locationName = this.getLocationName(req);

    const paramsObj = this.hasBody(req.body) ? req.body : req.query;

    this.placeModel.findOneAndUpdate(
        { locationName },
        paramsObj,
        { new: true, runValidators: true, fields: this.fields },
        (err, doc) => {
          if (err) {
            this.handleError(err, next);
            return;
          }
          console.log("Document updated successfully:", doc);
          res.locals.data = doc;
          next();
        }
    );
  }

  delete(
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
  ) {
    const locationName = this.getLocationName(req);

    this.placeModel.deleteOne({ locationName }, undefined, (err) => {
      if (err) {
        this.handleError(err, next);
        return;
      }
      const message = `Document '${locationName}' deleted successfully.`;
      console.log(message);
      res.locals.data = message;
      next();
    });
  }

  private getLocationName(req: express.Request): string {
    return req.params.location ?
      req.params.location :
      this.hasBody(req.body) ?
      req.body.locationName :
      req.query.locationName;
  }

  private hasBody(body: any): boolean {
    return Object.keys(body).length > 0;
  }

  private handleError(err: MongoError, next: express.NextFunction) {
    next(err);
    return;
  }
}
