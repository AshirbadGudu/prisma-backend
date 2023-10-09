import { Gender, Role } from "@prisma/client";
import { body, param } from "express-validator";

export const UserValidation = {
  create: [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .bail()
      .isLength({ max: 255 })
      .withMessage("Name must be less than 255 characters"),
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .bail()
      .isEmail()
      .withMessage("Email must be a valid email address"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .bail()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("phone")
      .optional({ nullable: true })
      .trim()
      .notEmpty()
      .withMessage("Phone number is required")
      .bail()
      .isMobilePhone("any")
      .withMessage("Phone must be a valid phone number"),
    body("country")
      .optional({ nullable: true })
      .trim()
      .notEmpty()
      .withMessage("Country is required")
      .bail()
      .isString()
      .withMessage("Country must be a string"),
    body("photo")
      .optional({ nullable: true })
      .isURL()
      .withMessage("Photo must be a valid URL"),
    body("gender")
      .optional({ nullable: true })
      .isIn(Object.values(Gender))
      .withMessage("Gender must be one of Male or Female"),
    body("role")
      .optional({ nullable: true })
      .isIn(Object.values(Role))
      .withMessage("Role must be one of Admin or Customer"),
    body("isVerified")
      .optional({ nullable: true })
      .isBoolean()
      .withMessage("isVerified must be a boolean value"),
    body("isBlocked")
      .optional({ nullable: true })
      .isBoolean()
      .withMessage("isBlocked must be a boolean value"),
    body("fcmToken.web")
      .optional({ nullable: true })
      .isString()
      .withMessage("FCM token (web) must be a string"),
    body("fcmToken.android")
      .optional({ nullable: true })
      .isString()
      .withMessage("FCM token (android) must be a string"),
    body("fcmToken.ios")
      .optional({ nullable: true })
      .isString()
      .withMessage("FCM token (iOS) must be a string"),
    body("location.lat")
      .optional({ nullable: true })
      .isFloat()
      .withMessage("Location latitude must be a float"),
    body("location.lng")
      .optional({ nullable: true })
      .isFloat()
      .withMessage("Location longitude must be a float"),
    body("location.address")
      .optional({ nullable: true })
      .isString()
      .withMessage("Location address must be a string"),
  ],

  update: [
    param("id").notEmpty().withMessage("ID is required").bail(),
    body("name")
      .optional({ nullable: true })
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .bail()
      .isLength({ max: 255 })
      .withMessage("Name must be less than 255 characters"),
    body("email")
      .optional({ nullable: true })
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .bail()
      .isEmail()
      .withMessage("Email must be a valid email address"),
    body("password")
      .optional({ nullable: true })
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .bail()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("phone")
      .optional({ nullable: true })
      .isMobilePhone("any")
      .withMessage("Phone must be a valid phone number"),
    body("country")
      .optional({ nullable: true })
      .trim()
      .isString()
      .withMessage("Country must be a string"),
    body("photo")
      .optional({
        nullable: true,
      })
      .isURL()
      .withMessage("Photo must be a valid URL"),
    body("gender")
      .optional({ nullable: true })
      .isIn(Object.values(Gender))
      .withMessage("Gender must be one of Male or Female"),
    body("role")
      .optional({ nullable: true })
      .isIn(Object.values(Role))
      .withMessage("Role must be one of Admin or Customer"),
    body("isVerified")
      .optional({ nullable: true })
      .isBoolean()
      .withMessage("isVerified must be a boolean value"),
    body("isBlocked")
      .optional({ nullable: true })
      .isBoolean()
      .withMessage("isBlocked must be a boolean value"),
    body("fcmToken.web")
      .optional({ nullable: true })
      .isString()
      .withMessage("FCM token (web) must be a string"),
    body("fcmToken.android")
      .optional({ nullable: true })
      .isString()
      .withMessage("FCM token (android) must be a string"),
    body("fcmToken.ios")
      .optional({ nullable: true })
      .isString()
      .withMessage("FCM token (iOS) must be a string"),
    body("location.lat")
      .optional({ nullable: true })
      .isFloat()
      .withMessage("Location latitude must be a float"),
    body("location.lng")
      .optional({ nullable: true })
      .isFloat()
      .withMessage("Location longitude must be a float"),
    body("location.address")
      .optional({ nullable: true })
      .isString()
      .withMessage("Location address must be a string"),
  ],

  login: [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .bail()
      .isEmail()
      .withMessage("Email must be a valid email address"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .bail()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],

  readById: [param("id").isMongoId().withMessage("Invalid ID")],

  delete: [param("id").isMongoId().withMessage("Invalid ID")],
};
