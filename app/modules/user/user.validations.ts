import { body, query } from "express-validator";
import validate from "../../utility/validate";

export const CreateUserValidator = [
  body("name").notEmpty().isString().withMessage("Enter a name"),
  body("email").trim().notEmpty().isEmail().withMessage("Enter a valid email."),
  body("password")
    .trim()
    .notEmpty()
    .isString()
    .withMessage("Enter a valid password"),
  validate,
];

export const LoginUserValidator = [
  body("email")
    .trim()
    .notEmpty()
    .isEmail()
    .withMessage("Enter a valid email id."),
  body("password")
    .trim()
    .notEmpty()
    .isString()
    .withMessage("Enter a vaid password."),
  validate,
];

export const ChangePasswordValidator = [
  body("email")
    .trim()
    .notEmpty()
    .isEmail()
    .withMessage("Enter a valid email id."),
  validate,
];

export const ChangePasswordTokenValidator = [
  body("forgotPasswordToken")
    .trim()
    .isString()
    .notEmpty()
    .withMessage("Enter a valid token."),
  body("newPassword")
    .trim()
    .isString()
    .notEmpty()
    .withMessage("Enter a valid Password."),
  validate,
];

export const FileNameValidator = [
  body("fileName")
    .trim()
    .notEmpty()
    .isString()
    .withMessage("Enter a valid file Name."),
  validate,
];

export const CycleIndexValidator = [
  query("cycleIndex")
    .trim()
    .notEmpty()
    .isFloat({ min: 0, max: 1000 })
    .withMessage("Enter a valid cycleIndex."),
  validate,
];
