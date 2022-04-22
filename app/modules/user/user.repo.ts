import userModel from "./user.schema";
import { IFileData, IUser } from "./user.types";
import { ObjectId } from "mongodb";
import { IFilters } from "../admin/admin.types";

const create = (user: IUser) => userModel.create(user);

const getAll = () => userModel.find();

const getOne = (email: string) =>
  userModel
    .findOne({ email: email })
    .populate({ path: "role", select: "name" })
    .populate({
      path: "cycles.cycle.tasks.taskid",
      select: "name taskCategory",
    })
    .populate({ path: "cycles.cycle.tasks.status", select: "name" });

const getByToken = (forgotPasswordToken: string) =>
  userModel.findOne({
    forgotPasswordToken: forgotPasswordToken,
    tokenExpiry: { $gt: Date.now() },
  });

const getbyRole = (role: string) =>
  userModel.find({
    role: role,
  });

const getbyEmail = (email: string) => userModel.findOne({ email: email });

const update = (updated_data: IUser) =>
  userModel.updateOne(
    {
      email: updated_data.email,
    },
    updated_data
  );

const pushFile = (fileData: IFileData) => {
  return userModel.updateOne(
    { email: fileData.email },
    {
      $set: {
        "cycles.$[].cycle.$[].tasks.$[taskElement].status": fileData.status,

        "cycles.$[].cycle.$[].tasks.$[taskElement].CertificateURl":
          fileData.fileUrl,

        "cycles.$[].cycle.$[].tasks.$[taskElement].CertificationDate":
          fileData.date,
      },
    },
    {
      arrayFilters: [
        {
          "taskElement._id": new ObjectId(fileData.taskId),
        },
      ],
    }
  );
};

const addNextCycle = (email: string, cycle: any) => {
  return userModel.updateOne(
    { email: email },
    {
      $push: { cycles: cycle },
    }
  );
};

const lockStatusUpdate = (email: string, lockStatus: boolean) => {
  return userModel.updateOne(
    { email: email },
    {
      isBlocked: lockStatus,
    }
  );
};

const updateUserStatus = (email: string, status: string) => {
  return userModel.updateOne(
    { email: email },
    {
      $set: {
        status: status,
      },
    }
  );
};

const filterUsers = (filters: IFilters) => {
  let { email, lockStatus, userStatus, year, page, itemsPerPage } = filters;
  const filter = [];
  const filterQuery = [];

  filter.push({ role: new ObjectId("625e36c0be9bb54da8934ee2") });

  if (email) {
    filter.push({ email: email });
  }

  if (year) {
    filter.push({
      $or: [{ cycleStart: year }, { cycleEnd: year }],
    });
  }

  if (lockStatus == "false") {
    filter.push({ isBlocked: false });
  } else if (lockStatus == "true") {
    filter.push({ isBlocked: true });
  }
  if (userStatus) {
    filter.push({ status: new ObjectId(userStatus) });
  }

  const match = {
    $match: {
      $and: filter,
    },
  };

  if (page && itemsPerPage) {
    filterQuery.push({ $skip: (+page - 1) * +itemsPerPage });
    filterQuery.push({ $limit: +itemsPerPage });
  }
  filterQuery.push(match);

  return userModel.aggregate([
    {
      $addFields: {
        currentCycle: {
          $slice: ["$cycles", -1],
        },
      },
    },
    ...filterQuery,

    {
      $project: {
        name: 1,
        email: 1,
        status: 1,
        isBlocked: 1,
        currentCycle: 1,
      },
    },
    {
      $lookup: {
        from: "taskstatuses",
        localField: "status",
        foreignField: "_id",
        as: "status",
      },
    },
  ]);
};

export default {
  create,
  getAll,
  getOne,
  getByToken,
  getbyRole,
  update,
  // pendingActivityCount,
  addNextCycle,
  pushFile,
  filterUsers,
  lockStatusUpdate,
  getbyEmail,
  updateUserStatus,
};
