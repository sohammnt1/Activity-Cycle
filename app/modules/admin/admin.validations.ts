import { body, query } from "express-validator";
import validate from "../../utility/validate";

export const LockStatusValidator = [
  body("lockStatus")
    .trim()
    .notEmpty()
    .isString()
    .withMessage("Enter a valid lockStatus."),
  validate,
];
