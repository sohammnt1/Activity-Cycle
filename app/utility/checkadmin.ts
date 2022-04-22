import userRepo from "../modules/user/user.repo";
import userModel from "../modules/user/user.schema";
import { ROLES } from "./db_constants";
import { hash } from "bcryptjs";

const adminUser = {
  name: "Admin",
  email: "admin@gmail.com",
  password: "",
  role: ROLES.Admin,
};

export const checkAdmin = async () => {
  try {
    const result = await userRepo.getbyRole(ROLES.Admin);
    if (result.length === 0) {
      const hashedPassword = await hash("admin", 12);
      adminUser.password = hashedPassword;
      userModel.create(adminUser);
    }
  } catch (error) {
    throw error;
  }
};
