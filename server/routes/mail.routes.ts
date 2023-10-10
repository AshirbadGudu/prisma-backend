import { Router } from "express";
import { mailController } from "../controllers";
import { validate } from "../middlewares";
import { MailValidation } from "../validations";

const router = Router();

router.post("/", MailValidation.send, validate, mailController.send);

export default router;
