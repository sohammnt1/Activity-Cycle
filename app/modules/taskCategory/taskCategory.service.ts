import taskCategoryRepo from "./taskCategory.repo";

const displayTaskCategories = () => taskCategoryRepo.getAll();

export default {
  displayTaskCategories,
};
