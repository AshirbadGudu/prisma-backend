import { body, param } from "express-validator";

export const NotificationValidation = {
  create: [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required")
      .bail()
      .isLength({ max: 255 })
      .withMessage("Title must be less than 255 characters"),
    body("body")
      .trim()
      .notEmpty()
      .withMessage("Body is required")
      .bail()
      .isLength({ max: 1000 })
      .withMessage("Body must be less than 1000 characters"),
  ],

  update: [
    param("id").notEmpty().withMessage("ID is required").bail(),
    body("title")
      .optional({ nullable: true })
      .trim()
      .notEmpty()
      .withMessage("Title is required")
      .bail()
      .isLength({ max: 255 })
      .withMessage("Title must be less than 255 characters"),
    body("body")
      .optional({ nullable: true })
      .trim()
      .notEmpty()
      .withMessage("Body is required")
      .bail()
      .isLength({ max: 1000 })
      .withMessage("Body must be less than 1000 characters"),
  ],

  readById: [param("id").isMongoId().withMessage("Invalid ID")],

  delete: [param("id").isMongoId().withMessage("Invalid ID")],
};
