import { ROLES } from "../../utility/db_constants";
import userService from "../user/user.service";
import { IFilters } from "./admin.types";

const lockStatusUpdate = (email: string, lockStatus: boolean) =>
  userService.lockStatusUpdate(email, lockStatus);

const automaticLockUser = (email: string) =>
  userService.automaticLockUser(email);

const filterUsers = (filters: IFilters) => userService.filterUsers(filters);

export default {
  lockStatusUpdate,
  filterUsers,
  automaticLockUser,
};
