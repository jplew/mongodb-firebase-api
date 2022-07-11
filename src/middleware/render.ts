import * as express from "express";

export const renderMiddleware = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
  console.log("this is the end");
  console.log("data", res.locals.data);

  res.json(res.locals.data);
};
