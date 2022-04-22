import roleRepo from "./role.repo";

const displayRoles = () => roleRepo.getAll();

export default {
  displayRoles,
};
