import cors from "cors";
import express from "express";
import helmet from "helmet";
import multer from "multer";
import { ListenerPlugin, RouterPlugin } from "./plugins";

const app = express();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Set the destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Set the file name for uploaded files
  },
});

const upload = multer({ storage });

app
  .use(helmet())
  .use(cors())
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(upload.any());

RouterPlugin.setup(app);
ListenerPlugin.listen(app);
