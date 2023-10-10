import { Router } from "express";
import { notificationController } from "../controllers";
import { authenticate, validate } from "../middlewares";
import { NotificationValidation } from "../validations";

const router = Router();

// Require authentication for creating a notification
router.post(
  "/",
  authenticate.any, // You can specify the required authentication middleware here
  NotificationValidation.create,
  validate,
  notificationController.create
);

// Require authentication for updating a notification
router.put(
  "/:id",
  authenticate.any, // You can specify the required authentication middleware here
  NotificationValidation.update,
  validate,
  notificationController.update
);

// Require authentication for getting notification by ID
router.get(
  "/:id",
  authenticate.any, // You can specify the required authentication middleware here
  NotificationValidation.readById,
  validate,
  notificationController.readById
);

// Require authentication for deleting a notification
router.delete(
  "/:id",
  authenticate.any, // You can specify the required authentication middleware here
  NotificationValidation.delete,
  validate,
  notificationController.delete
);

export default router;
