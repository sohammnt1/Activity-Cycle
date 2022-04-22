import { Router, Request, Response, NextFunction } from "express";
import taskCategoryService from "./taskCategory.service";
import { ResponseHandler } from "../../utility/response";

const router = Router();

router.get(
  "/display",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await taskCategoryService.displayTaskCategories();
      res.send(new ResponseHandler(result));
    } catch (error) {
      next(error);
    }
  }
);

export default router;
