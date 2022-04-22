import { Router, Request, Response, NextFunction } from "express";
import roleService from "./role.service";
import { ResponseHandler } from "../../utility/response";

const router = Router();

router.get(
  "/display",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await roleService.displayRoles();
      res.send(new ResponseHandler(result));
    } catch (error) {
      next(error);
    }
  }
);

export default router;
