import { Router } from "express";
import { userController } from "../controllers";
import { authenticate, validate } from "../middlewares";
import { UserValidation } from "../validations";

const router = Router();

// Require admin authentication for getting all users
router.get("/", authenticate.admin, userController.readAll);

router.get("/current/user", authenticate.any, userController.currentUser);

// Require authentication for getting user by ID
router.get(
  "/:id",
  authenticate.any,
  UserValidation.readById,
  validate,
  userController.readById
);

// Require admin authentication for creating a user
router.post(
  "/",
  authenticate.admin,
  UserValidation.create,
  validate,
  userController.create
);

// Require authentication for updating a user
router.put(
  "/:id",
  // authenticate.any,
  UserValidation.update,
  validate,
  userController.update
);

// Require admin authentication for deleting a user
router.delete(
  "/:id",
  authenticate.admin,
  UserValidation.delete,
  validate,
  userController.delete
);

// No authentication required for login
router.post("/login", UserValidation.login, validate, userController.login);

// create route for signup
router.post("/signup", UserValidation.create, validate, userController.signup);

export default router;
