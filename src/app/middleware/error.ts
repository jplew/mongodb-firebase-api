import * as express from 'express'

export const errorMiddleware = (
  err: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  console.log('doh!')
  console.error('server says:', err.message)

  const status = err.code === 'not-found' ? 404 : 500

  res.status(status).send(err.message)
}
