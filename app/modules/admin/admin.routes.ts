import { Router, Request, Response, NextFunction } from "express";
import adminService from "./admin.service";
import { ResponseHandler } from "../../utility/response";
import { permit } from "../../utility/authorize";
import { ROLES } from "../../utility/db_constants";
import { LockStatusValidator } from "./admin.validations";

const router = Router();

router.put(
  "/lock-status-update",
  permit([ROLES.Admin]),
  LockStatusValidator,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const email = req.body.email;
      const lockStatus = req.body.lockStatus;

      await adminService.lockStatusUpdate(email, lockStatus);

      res.send(new ResponseHandler("User Blocked"));
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/auto-lock",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const email = res.locals.user.email;
      await adminService.automaticLockUser(email);

      res.send(new ResponseHandler("User Account Blocked"));
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/filter-user",
  permit([ROLES.Admin]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = req.query;
      const result = await adminService.filterUsers(filters);

      res.send(new ResponseHandler(result));
    } catch (error) {
      next(error);
    }
  }
);

export default router;
