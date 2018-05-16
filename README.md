# mongodb-firebase-api

### Restful API built with Typescript, Node.js, Express, MongoDB, Mongoose, and Firebase Functions

This is a sample API which calls a MongoDB deployed to mLab. The DB is a collection of "Location" documents with the following fields:

* Location Name
* Description
* Latitude
* Longitude

This back-end offers full CRUD functionality, and can be consumed by any single-page app front-end. To see the matching front-end I wrote go here:

* Live site: [https://mongodb-api.firebaseapp.com/](https://mongodb-api.firebaseapp.com/)

* Github Repo: [https://github.com/jplew/mongodb-firebase-app](https://github.com/jplew/mongodb-firebase-app)

### Features

* Full CRUD functionality

  * GET

    * Get all: https://us-central1-mongodb-api.cloudfunctions.net/api/places/

      * can be sorted ascending or descending with "sort" flag:
        * ascending: https://us-central1-mongodb-api.cloudfunctions.net/api/places?sort=asc
        * descending: https://us-central1-mongodb-api.cloudfunctions.net/api/places?sort=desc

    * Get single location: https://us-central1-mongodb-api.cloudfunctions.net/api/places/[location]

  * POST & PUT

    * https://us-central1-mongodb-api.cloudfunctions.net/api/places/[location]
      * By default, params are sent via the request body
      * Params can be also be sent in the url like so: https://us-central1-mongodb-api.cloudfunctions.net/api/places/[location]?locationName=Victoria?latitude=12.4444?longitude=-120.55555?description=lots%20of%20people

  * DELETE
    * https://us-central1-mongodb-api.cloudfunctions.net/api/places/[location]

* Written in Typescript
* Deployed to Google Cloud Functions
* Uses Mongoose as DRM
* Does not use authentication for purposes of demonstration

### Questions or Comments

email: jp@kriyate.co
