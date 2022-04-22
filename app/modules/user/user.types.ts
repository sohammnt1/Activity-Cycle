export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  forgotPasswordToken: string;
  tokenExpiry: Date;
  deleted: boolean;
}

export interface IFileData {
  fileSize: number;
  fileName: string;
  fileUrl: string;
  email: string;
  status: string;
  taskId: string;
  date: Date;
  cycleIndex: number;
}

export interface IFile {
  fileName: string;
  fileSize: number;
  fileUrl: string;
}
