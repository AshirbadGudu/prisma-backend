import { Router } from "express";
import { fileController } from "../controllers";

const router = Router();

router.post("/", fileController.upload);
router.delete("/", fileController.delete);

export default router;
