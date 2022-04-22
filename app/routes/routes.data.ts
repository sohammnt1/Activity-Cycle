import { Route } from "./routes.types";
import UserRouter from "../modules/user/user.routes";
import RoleRouter from "../modules/role/role.routes";
import AdminRouter from "../modules/admin/admin.routes";
import TasksRouter from "../modules/tasks/tasks.routes";
import TaskCategoryRouter from "../modules/taskCategory/taskCategory.routes";
import TaskStatusRouter from "../modules/taskStatus/taskStatus.routes";

export const routes = [
  new Route("/user", UserRouter),
  new Route("/role", RoleRouter),
  new Route("/admin", AdminRouter),
  new Route("/tasks", TasksRouter),
  new Route("/task-category", TaskCategoryRouter),
  new Route("/task-status", TaskStatusRouter),
];

export const excludedPaths = [
  { method: "POST", route: "/user/login" },
  { method: "POST", route: "/user/register" },
  { method: "POST", route: "/user/change-password" },
  { method: "POST", route: "/user/reset-password" },
  { method: "GET", route: "/tasks/display" },
  { method: "GET", route: "/task-category/display" },
  { method: "GET", route: "/task-status/display" },
  { method: "GET", route: "/role/display" },
];
