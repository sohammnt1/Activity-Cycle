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
import { IFileData } from "./user.types";
import formidable from "formidable";
import path from "path";
import fs from "fs";
import {
  checkIfFolderNotExist,
  createFolderFunction,
} from "../../utility/storageFunctions";

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

      const email = res.locals.user.email;
      const fileData: IFileData = {
        fileSize: 0,
        fileName: "",
        fileUrl: "",
        email: "",
        status: "",
        taskId: "",
        date: new Date(),
        cycleIndex: 0,
      };

      form.parse(req, async (err: any, fields: any, files: any) => {
        if (!files.file) {
          return "File Not Uploaded";
        }

        let userDir = path.join(__dirname, "..", "..", "dummyS3", email);

        if (checkIfFolderNotExist(userDir)) {
          createFolderFunction(userDir);
        }
        let fileName = `${Math.floor(Math.random() * 101)} ${
          files.file.originalFilename
        }`;

        const uploadFolder = path.join(
          __dirname,
          "..",
          "..",
          "dummyS3",
          email,
          fileName
        );

        let fileUrl = path
          .join("app", "dummyS3", email, files.file.originalFilename)
          .split("\\")
          .join("/");

        fileData.fileSize = files.file.size / 1000;
        fileData.fileName = files.file.originalFilename;
        fileData.taskId = fields.taskId;
        fileData.status = "625e5b81be9bb54da8934ef7";
        fileData.email = email;
        fileData.fileUrl = fileUrl;
        fileData.date = fields.certificationDate;
        fileData.cycleIndex = fields.cycleIndex;

        try {
          if (checkIfFolderNotExist(uploadFolder)) {
            await userService.addFile(fileData);

            const oldPath = files.file.filepath;
            var rawData = fs.readFileSync(oldPath);

            fs.writeFile(uploadFolder, rawData, function (err) {
              if (err) console.log(err);
              return res.send(new ResponseHandler("Successfully Uploaded"));
            });
          } else {
            throw "File Already Exists";
          }
        } catch (error) {
          next(error);
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
