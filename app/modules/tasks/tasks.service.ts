import taskRepo from "./tasks.repo";

const displayTasks = () => taskRepo.getAll();

export default {
  displayTasks,
};
