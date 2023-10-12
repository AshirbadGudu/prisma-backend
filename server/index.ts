import cors from "cors";
import express from "express";
import helmet from "helmet";
import { upload } from "./configs";
import { ListenerPlugin, RouterPlugin } from "./plugins";

const app = express();

app
  .use(helmet())
  .use(cors())
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(upload.any());

RouterPlugin.setup(app);
ListenerPlugin.listen(app);
