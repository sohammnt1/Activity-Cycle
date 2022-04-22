import fs from "fs";

export const checkIfFolderNotExist = (dirName: string) =>
  !fs.existsSync(dirName);

export const createFolderFunction = (dirName: string) =>
  fs.mkdir(dirName, (error: any) => {
    if (error) {
      throw error;
    }
  });
