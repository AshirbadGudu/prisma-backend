import { Router } from "express";
import { notificationController } from "../controllers";
import { authenticate, validate } from "../middlewares";
import { NotificationValidation } from "../validations";

const router = Router();

// Require authentication for creating a notification
router.get("/", authenticate.any, notificationController.readAll);

// Require authentication for creating a notification
router.post(
  "/",
  authenticate.any,
  NotificationValidation.create,
  validate,
  notificationController.create
);

// Require authentication for updating a notification
router.put(
  "/:id",
  authenticate.any,
  NotificationValidation.update,
  validate,
  notificationController.update
);

// Require authentication for getting notification by ID
router.get(
  "/:id",
  authenticate.any,
  NotificationValidation.readById,
  validate,
  notificationController.readById
);

// Require authentication for deleting a notification
router.delete(
  "/:id",
  authenticate.any,
  NotificationValidation.delete,
  validate,
  notificationController.delete
);

// Require authentication for deleting all notifications
router.delete(
  "/delete/many",
  authenticate.any,
  notificationController.deleteAll
);

// Require authentication for sending a notification to multiple users
router.post(
  "/send/many",
  authenticate.any,
  NotificationValidation.sendMany,
  validate,
  notificationController.sendToMultipleUsers
);

export default router;
