import * as express from 'express'
import * as functions from 'firebase-functions'
import { Api } from './api'

const PlacesApi: express.Application = Api.bootstrap().app

export const api = functions.https.onRequest(PlacesApi)
