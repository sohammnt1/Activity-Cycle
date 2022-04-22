import { Router, Request, Response, NextFunction } from "express";
import {
  ChangePasswordTokenValidator,
  ChangePasswordValidator,
  CreateUserValidator,
  CycleIndexValidator,
  LoginUserValidator,
} from "./user.validations";
import userService from "./user.service";
import { ResponseHandler } from "../../utility/response";
import { permit } from "../../utility/authorize";
import { ROLES } from "../../utility/db_constants";
import formidable from "formidable";
import { fileUpload } from "../../utility/fileUpload";

const router = Router();

router.post(
  "/register",
  CreateUserValidator,

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.body;

      const result = await userService.createUser(user);

      res.send(new ResponseHandler(result));
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/login",
  LoginUserValidator,

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { email, password } = req.body;

      const result = await userService.authenticateUser(email, password);

      res.send(new ResponseHandler(result));
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/change-password",
  ChangePasswordValidator,

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;

      const result = await userService.createChangePasswordRequest(email);

      res.send(new ResponseHandler(result));
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/reset-password",
  ChangePasswordTokenValidator,

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const forgotPasswordToken = req.body.forgotPasswordToken as string;
      const newPassword = req.body.newPassword as string;

      const result = await userService.changePassword(
        forgotPasswordToken,
        newPassword
      );

      res.send(new ResponseHandler(result));
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/user-dashboard",
  permit([ROLES.User, ROLES.Admin]),
  CycleIndexValidator,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const email = res.locals.user.email;
      let cycleIndex = req.query.cycleIndex as unknown as number;
      const result = await userService.displayActivities(cycleIndex, email);

      res.send(new ResponseHandler(result));
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/activity-count",
  permit([ROLES.User, ROLES.Admin]),
  CycleIndexValidator,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const email = res.locals.user.email;
      let cycleIndex = req.query.cycleIndex as unknown as number;
      const result = await userService.pendingActivityCount(cycleIndex, email);

      res.send(new ResponseHandler(result));
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/next-cycle",
  permit([ROLES.User, ROLES.Admin]),
  CycleIndexValidator,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const email = res.locals.user.email;
      let cycleIndex = req.query.cycleIndex as unknown as number;
      const result = await userService.addNextCycle(cycleIndex, email);

      res.send(new ResponseHandler(result));
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/add-certificate",
  permit([ROLES.User, ROLES.Admin]),

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const form: any = new formidable.IncomingForm();

      let result = fileUpload(form);
      result(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
