import { hash, compare } from "bcryptjs";
import userRepo from "./user.repo";
import { generateToken } from "../../utility/jwt";
import { IFileData, IUser } from "./user.types";
import sgMail from "@sendgrid/mail";
import * as randomToken from "rand-token";
import { cycles } from "../../utility/taskAddition";
import { IFilters } from "../admin/admin.types";
import { ROLES } from "../../utility/db_constants";

const createUser = async (user: IUser) => {
  try {
    const existingUser = await userRepo.getOne(user.email);

    if (existingUser) {
      throw "User Already Exist";
    }

    const hashedPassword = await hash(user.password, 12);

    // const tasks = await tasksService.displayTasks();
    // let cycleStart;

    // for (let i of tasks) {
    // for (let cycleIndex = 0; cycleIndex < 3; cycleIndex++) {
    //   console.log(`cycleIndex:${cycleIndex}`);

    //   for (let taskIndex = 0; taskIndex < 3; taskIndex++) {
    //     console.log(`TaskIndex:${taskIndex}`);
    // if (i.isOptional) {
    // console.log(1);
    // }
    // }
    // }
    // }
    // console.log(tasks);

    const userData = {
      ...user,
      ["password"]: hashedPassword,
      cycles,
    };

    const result = await userRepo.create(userData);

    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

    const msg = {
      from: "testingformail797@gmail.com",
      to: userData.email,
      subject: "Account Sucessfully Created",
      text: `Dear,${userData.name}. Your Account has been created.\nHere are the login credentials.\n email: ${userData.email} Password:${user.password}`,
    };

    //await sgMail.send(msg);

    return result;
  } catch (error) {
    throw error;
  }
};

const authenticateUser = async (email: string, password: string) => {
  try {
    const user = await userRepo.getOne(email);

    if (user.role._id == ROLES.User) {
      const autoLock = await automaticLockUser(email);
      if (autoLock === "Locked" || user.isBlocked)
        throw "Your Account is Blocked";
    }

    if (!user) throw "User doesn't exists";
    const doMatch = await compare(password, user.password);

    if (!doMatch) throw "Invalid Password";
    const token = generateToken(user);
    const role = user.role;

    return { token, role };
  } catch (error) {
    throw error;
  }
};

const createChangePasswordRequest = async (email: string) => {
  try {
    const user = await userRepo.getOne(email);

    if (!user) throw "User doesn't exists";

    user.forgotPasswordToken = randomToken.generate(6);
    user.tokenExpiry = Date.now() + 1000 * 60 * 60;

    await user.save();

    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

    const msg = {
      from: "testingformail797@gmail.com",
      to: user.email,
      subject: "Password Reset Request",
      html:
        '<p>You requested for reset password, kindly use this <a href="http://localhost:4200/reset-password">link</a> to reset your password enter the token ' +
        user.forgotPasswordToken +
        "</p>",
    };

    await sgMail.send(msg);

    return "Token Sent Sucessfully";
  } catch (error) {
    throw error;
  }
};

const changePassword = async (
  forgotPasswordToken: string,
  newPassword: string
) => {
  try {
    const user = await userRepo.getByToken(forgotPasswordToken);

    if (!user) throw "Token doesn't match or is expired";

    user.password = await hash(newPassword, 12);

    await user.save();

    return "User Password Updated";
  } catch (error) {
    throw error;
  }
};

const displayActivities = async (cycleIndex: number, email: string) => {
  const user = await userRepo.getOne(email);

  return {
    name: user.name,
    email: user.email,
    activities: user.cycles[cycleIndex],
  };
  //take cycle index to display appropriate task
};

const pendingActivityCount = async (cycleIndex: number, email: string) => {
  const activities = await userRepo.getOne(email);

  const cycle = activities.cycles[cycleIndex].cycle;

  const pendingCount = [];

  for (let cycleElement of cycle) {
    for (let taskElement of cycleElement.tasks) {
      if (taskElement.status._id.toHexString() == "625e5b75be9bb54da8934ef6") {
        pendingCount.push(taskElement.status);
      }
    }
  }

  return pendingCount.length;
};

const addNextCycle = async (cycleIndex: number, email: string) => {
  try {
    // let pendingCount = await pendingActivityCount(cycleIndex , email);
    let pendingCount = 0;

    await userRepo.updateUserStatus(email, "625e5b75be9bb54da8934ef6");

    if (pendingCount == 0) {
      await userRepo.addNextCycle(email, cycles[0]);
      await userRepo.updateUserStatus(email, "625e5b75be9bb54da8934ef6");

      return "New cycle created";
    } else {
      throw "Task are pending to be completed";
    }
  } catch (error) {
    throw error;
  }
};

const lockStatusUpdate = async (email: string, lockStatus: boolean) => {
  const result = await userRepo.lockStatusUpdate(email, lockStatus);

  sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

  let status = "";
  if (lockStatus) status = "Locked";
  else status = "Unlocked";

  const msg = {
    from: "testingformail797@gmail.com",
    to: email,
    subject: "Account Has Been Blocked",
    text:
      `Dear User. Your Account has been ` +
      status +
      `by the admin for voilating the policies.`,
  };

  return result;
};

const automaticLockUser = async (email: string) => {
  const user = await userRepo.getOne(email);

  const latestCycle = user.cycles.length - 1;

  const endYearLatestCycle = user.cycles[latestCycle].cycle[2].cycleEnd;
  const currentYear = new Date().getFullYear();

  const count = await pendingActivityCount(latestCycle, email);

  if (count > 0 && currentYear > endYearLatestCycle) {
    await userRepo.lockStatusUpdate(email, true);
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

    const msg = {
      from: "testingformail797@gmail.com",
      to: email,
      subject: "Account Has Been Blocked",
      text: `Dear User. Your Account has been Blocked by the admin for voilating the policies.`,
    };

    return "Locked";
  } else {
    return "No Need to Lock";
  }
};

const addFile = async (fileData: IFileData) => {
  await userRepo.pushFile(fileData);
  let pendingActivities = await pendingActivityCount(
    fileData.cycleIndex,
    fileData.email
  );
  let status = "";

  if (pendingActivities == 0) {
    status = "625e5b81be9bb54da8934ef7";
  } else {
    status = "625e5b75be9bb54da8934ef6";
  }

  await userRepo.updateUserStatus(fileData.email, status);
  return "File Pushed";
};

const filterUsers = async (filters: IFilters) => {
  let result = await userRepo.filterUsers(filters);

  let updatedResult = [];

  for (let i in result) {
    const currentCycleStart = result[i].currentCycle[0].cycle[0].cycleStart;
    const currentCycleEnd = result[i].currentCycle[0].cycle[2].cycleEnd;

    const { currentCycle, ...rest } = result[i];

    updatedResult.push({ ...rest, currentCycleStart, currentCycleEnd });
  }

  return updatedResult;
};

export default {
  createUser,
  authenticateUser,
  createChangePasswordRequest,
  changePassword,
  displayActivities,
  pendingActivityCount,
  addNextCycle,
  lockStatusUpdate,
  filterUsers,
  addFile,
  automaticLockUser,
};
