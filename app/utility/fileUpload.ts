import { NextFunction, Response, Request } from "express";
import path from "path";
import fs from "fs";
import {
  checkIfFolderNotExist,
  createFolderFunction,
} from "./storageFunctions";
import { IFileData } from "../modules/user/user.types";
import userService from "../modules/user/user.service";
import { ResponseHandler } from "./response";

export const fileUpload = (form: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
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
        res.send(new ResponseHandler("File Not Uploaded"));
        return;
      }

      let userDir = path.join(__dirname, "..", "dummyS3", email);

      if (checkIfFolderNotExist(userDir)) {
        createFolderFunction(userDir);
      }

      let fileName = `${Math.floor(Math.random() * 101)} ${
        files.file.originalFilename
      }`;

      const uploadFolder = path.join(
        __dirname,
        "..",
        "dummyS3",
        email,
        fileName
      );

      let fileUrl = path
        .join("app", "dummyS3", email, fileName)
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
            res.send(new ResponseHandler("Successfully Uploaded"));
          });
        } else {
          res.send(new ResponseHandler("File Already Exists"));
        }
      } catch (error) {
        console.log(error);

        next(error);
      }
    });
  };
};
