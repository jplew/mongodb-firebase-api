import * as cors from "cors";
import * as express from "express";
import * as mongoose from "mongoose";
import { errorMiddleware } from "./middleware/error";
import { renderMiddleware } from "./middleware/render";
import { Routes } from "./routes";
import { placeSchema } from "./schemas/schemas";

require("dotenv").config();

export class Api {
  static bootstrap(): Api {
    return new Api();
  }

  config() {
    const app = express();
    app.use(cors({ origin: true }));

    app.use(express.json());

    const MONGO_URI = process.env.MONGO_URI || "";

    // console.log({ MONGO_URI });
    // Mongo Connection string is secret, loaded from a .env file
    const connection: mongoose.Connection = mongoose.createConnection(
        MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }
    );

    const placeModel = connection.model("Place", placeSchema, "places");

    Routes.init(app, placeModel);

    app.use(renderMiddleware);
    app.use(errorMiddleware);

    const port = 3000;

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  }
}

Api.bootstrap().config();


