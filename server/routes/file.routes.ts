import { Router } from "express";
import { fileController } from "../controllers";

const router = Router();

router.post("/", fileController.upload);
router.post("/webp", fileController.uploadWebp);
router.delete("/", fileController.delete);

export default router;
