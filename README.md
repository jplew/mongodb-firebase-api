# REST API built with Typescript, Node.js, Express, MongoDB, Mongoose

This is a simple API which performs all basic CRUD operations on a Atlas-hosted MongoDB. The DB is a collection of "Location" documents with the following fields:

- Location Name
- Description
- Latitude
- Longitude

This backend is consumed by the following frontend client:

- Live site: [https://mongodb-angular-app.web.app](https://mongodb-angular-app.web.app)
- Github Repo: [https://github.com/jplew/mongodb-firebase-app](https://github.com/jplew/mongodb-firebase-app)

API used to be hosted on Firebase, currently using [Fly](https://fly.io).

### API Features

- Full CRUD functionality

  - GET

    - Get all: https://crudapp.fly.dev/places

      - can be sorted ascending or descending with "sort" flag:
        - ascending: https://crudapp.fly.dev/places?sort=asc
        - descending: https://crudapp.fly.dev/places?sort=desc

    - Get single location: https://crudapp.fly.dev/places/[location]

  - POST & PUT

    - https://crudapp.fly.dev/places/[location]
      - By default, params are sent via the request body
      - Params can be also be sent in the url like so: https://crudapp.fly.dev/places/[location]?locationName=Victoria?latitude=12.4444?longitude=-120.55555?description=lots%20of%20people

  - DELETE
    - https://crudapp.fly.dev/places/[location]

- Written in Typescript
- Deployed to Google Cloud Functions
- Uses Mongoose as DRM
- Does not use authentication for purposes of demonstration

