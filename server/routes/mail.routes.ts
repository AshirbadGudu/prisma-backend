import { Router } from "express";
import { mailController } from "../controllers";

const router = Router();

router.post("/", mailController.send);

export default router;
