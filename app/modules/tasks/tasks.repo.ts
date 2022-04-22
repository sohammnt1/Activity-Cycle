import tasksModel from "./tasks.schema";

const getAll = () => tasksModel.find();

export default {
  getAll,
};
