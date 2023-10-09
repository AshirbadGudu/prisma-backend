import PRISMA from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { Unauthorized } from "http-errors";
import jwt from "jsonwebtoken";
import { configs, prisma } from "../configs";

interface JwtPayload {
  userId: string;
}
declare global {
  namespace Express {
    interface Request {
      currentUser?: PRISMA.User;
    }
  }
}

export const verifyToken = async (req: Request) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader)
    throw new Unauthorized("Authorization header is missing");

  const token = authorizationHeader.split(" ")[1];
  if (!token) throw new Unauthorized("Token is missing");

  const jwtSecret = configs.JWT_SECRET;
  if (!jwtSecret) throw new Error("JWT secret is not set");

  const decodedToken = jwt.verify(token, jwtSecret) as JwtPayload;

  const user = await prisma.user.findUnique({
    where: { id: decodedToken.userId },
  });
  if (!user) throw new Unauthorized("User not found");
  return user;
};

export const authenticate = {
  admin: async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const user = await verifyToken(req);
      if (user.role !== "Admin")
        throw Unauthorized("You can't perform this action!");
      req.currentUser = user;
      next();
    } catch (error) {
      next(error);
    }
  },
  customer: async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const user = await verifyToken(req);
      if (user.role !== "Customer")
        throw Unauthorized("Only Customer can perform this action!");
      req.currentUser = user;
      next();
    } catch (error) {
      next(error);
    }
  },
  any: async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const user = await verifyToken(req);
      if (!user.role) throw Unauthorized("You can't perform this action!");
      req.currentUser = user;
      next();
    } catch (error) {
      next(error);
    }
  },
};
