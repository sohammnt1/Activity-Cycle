import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

import { ResponseHandler } from "./response";

const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .send(new ResponseHandler(null, validationResult(req)));
  }
  next();
};

export default validate;
