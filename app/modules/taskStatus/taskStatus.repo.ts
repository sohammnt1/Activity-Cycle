import taskStatusModel from "./taskStatus.schema";

const getAll = () => taskStatusModel.find();

export default {
  getAll,
};
