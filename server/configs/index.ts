import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

config();

const configs = {
  PORT: process.env.PORT,
  JWT_SECRET: `${process.env.JWT_SECRET}`,
  API_VERSION: `api/v1`,
  HOST: `${process.env.HOST}`,
  MAIL_SERVICE: `${process.env.MAIL_SERVICE}`,
  MAIL_PORT: process.env.MAIL_PORT,
  MAIL_HOST: `${process.env.MAIL_HOST}`,
  MAIL_FROM: `${process.env.MAIL_FROM}`,
  MAIL_USER: `${process.env.MAIL_USER}`,
  MAIL_PASS: `${process.env.MAIL_PASS}`,
};

export { configs, prisma };
