import { body, param } from "express-validator";

export const MailValidation = {
  send: [
    body("to")
      .isArray({ min: 1 })
      .withMessage("At least one recipient email is required")
      .custom((value: string[]) => {
        // Check that all email addresses in the 'to' array are valid
        return value.every((email) => {
          if (!email || typeof email !== "string") {
            return false;
          }
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        });
      })
      .withMessage("Recipient emails must be valid email addresses"),
    body("subject").notEmpty().withMessage("Email subject is required"),
    body("html")
      .notEmpty()
      .withMessage("Email message body is required")
      .isString()
      .withMessage("Email message body must be a string"),
    body("cc")
      .optional({ nullable: true, checkFalsy: true })
      .isArray()
      .withMessage("CC must be an array of email addresses")
      .custom((value: string[]) => {
        // Check that all CC email addresses are valid
        return value.every((email) => {
          if (!email || typeof email !== "string") {
            return false;
          }
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        });
      })
      .withMessage("CC email addresses must be valid email addresses"),
    body("bcc")
      .optional({ nullable: true, checkFalsy: true })
      .isArray()
      .withMessage("BCC must be an array of email addresses")
      .custom((value: string[]) => {
        // Check that all BCC email addresses are valid
        return value.every((email) => {
          if (!email || typeof email !== "string") {
            return false;
          }
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        });
      })
      .withMessage("BCC email addresses must be valid email addresses"),
    // You can add more validation rules for attachments and other fields if needed
  ],
};
