import cors from "cors";
import express from "express";
import helmet from "helmet";
import { ListenerPlugin, RouterPlugin } from "./plugins";

const app = express();

app
  .use(helmet())
  .use(cors())
  .use(express.json())
  .use(express.urlencoded({ extended: true }));

RouterPlugin.setup(app);
ListenerPlugin.listen(app);
