import * as express from 'express'

export const errorMiddleware = (
  err: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  console.log('doh!')
  console.error('server says:', err.message)

  res.status(500).send(err.message)
}
