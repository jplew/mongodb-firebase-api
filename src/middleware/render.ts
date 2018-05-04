import * as express from 'express'

export const renderMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  console.log('the end of the line')

  res.json(res.locals.data)
}
