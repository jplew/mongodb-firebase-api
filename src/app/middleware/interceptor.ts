import * as express from 'express'

export const interceptMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  console.log('intercept req is', req)
  console.log('intercept res is', res)

  next()
}
