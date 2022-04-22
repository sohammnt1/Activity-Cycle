import jwt from "jsonwebtoken";
import { IUser } from "../modules/user/user.types";

const { sign, verify } = jwt;

export const generateToken = (user: IUser) => {
  const { JWT_SECRET } = process.env;
  if (JWT_SECRET) {
    const token = sign(JSON.parse(JSON.stringify(user)), JWT_SECRET);
    return token;
  }
  throw new Error("Internal Failure");
};

export const verifyToken = (token: string | undefined) => {
  const { JWT_SECRET } = process.env;
  if (JWT_SECRET && token) {
    const payload = verify(token, JWT_SECRET);
    return payload;
  }
  throw new Error("Internal Failure");
};
