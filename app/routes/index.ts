import {
  Application,
  json,
  Request,
  Response,
  NextFunction,
  static as expressStatic,
} from "express";
import helmet from "helmet";
import cors from "cors";

import { excludedPaths, routes } from "./routes.data";

import { authorize } from "../utility/authorize";
import { ResponseHandler } from "../utility/response";

export const registerRoutes = (app: Application) => {
  app.use(json());
  app.use(helmet());
  app.use(cors());

  app.use(authorize(excludedPaths));
  app.use("/app/dummyS3", expressStatic("app/dummyS3"));

  for (const route of routes) {
    app.use(route.path, route.router);
  }
  app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    res.status(error.statusCode ?? 500).send(new ResponseHandler(null, error));
  });
};
