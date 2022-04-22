import roleModel from "./role.schema";

const getAll = () => roleModel.find();

export default {
  getAll,
};
