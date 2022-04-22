import taskCategoryModel from "./taskCategory.schema";

const getAll = () => taskCategoryModel.find();

export default {
  getAll,
};
