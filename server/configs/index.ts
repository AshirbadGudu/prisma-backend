import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

config();

const configs = {
  PORT: process.env.PORT,
  JWT_SECRET: `${process.env.JWT_SECRET}`,
  API_VERSION: `api/v1`,
  HOST: `${process.env.HOST}`,
};

export { configs, prisma };
