import * as functions from "firebase-functions";
import * as express from "express";
import { Api } from "./app/api";

const PlacesApi: express.Application = Api.bootstrap().app;

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", { structuredData: true });
//   response.send("Hello from Firebase!");
// });

export const api = functions.https.onRequest(PlacesApi);

// export const api = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", { structuredData: true });
//   response.send("Hello API!");
// });

// const MongoClient = require("mongodb").MongoClient;

// const uri =
//   "mongodb+srv://jplew:<password>@crudapp.mgylm.mongodb.net/CrudApp?retryWrites=true&w=majority";
// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// client.connect((err) => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
