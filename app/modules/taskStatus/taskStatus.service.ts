import taskStatusRepo from "./taskStatus.repo";

const displayTaskStatus = () => taskStatusRepo.getAll();

export default {
  displayTaskStatus,
};
