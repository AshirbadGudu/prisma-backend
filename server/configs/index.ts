import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

const prisma = new PrismaClient();

config();

const configs = {
  PORT: process.env.PORT,
  JWT_SECRET: `${process.env.JWT_SECRET}`,
  API_VERSION: `api/v1`,
  HOST: `${process.env.HOST}`,
  // Mail Configs
  MAIL_SERVICE: `${process.env.MAIL_SERVICE}`,
  MAIL_PORT: process.env.MAIL_PORT,
  MAIL_HOST: `${process.env.MAIL_HOST}`,
  MAIL_FROM: `${process.env.MAIL_FROM}`,
  MAIL_USER: `${process.env.MAIL_USER}`,
  MAIL_PASS: `${process.env.MAIL_PASS}`,
  // Firebase Configs
  PROJECT_ID: `${process.env.PROJECT_ID}`,
  PRIVATE_KEY: `${process.env.PRIVATE_KEY}`,
  CLIENT_EMAIL: `${process.env.CLIENT_EMAIL}`,
};

export * from "./mail.config";
export * from "./firebase.config";
export { configs, prisma };
