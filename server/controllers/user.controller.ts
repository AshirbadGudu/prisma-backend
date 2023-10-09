import { RequestHandler } from "express";
import { NotFound } from "http-errors";
import { userService } from "../services";

export const userController: {
  create: RequestHandler;
  readById: RequestHandler;
  readAll: RequestHandler;
  update: RequestHandler;
  delete: RequestHandler;
  login: RequestHandler;
  signup: RequestHandler;
  currentUser: RequestHandler;
} = {
  async create(req, res, next) {
    try {
      const user = await userService.create(req.body);

      res.json({
        success: true,
        msg: "User created successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const data = await userService.login({ email, password });
      res.json({
        success: true,
        msg: "Login successful",
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async signup(req, res, next) {
    try {
      const data = await userService.signup(req.body);
      res.json({
        success: true,
        msg: "Signup successful",
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async readById(req, res, next) {
    try {
      const user = await userService.readById(req.params.id);

      res.json({
        success: true,
        msg: "User retrieved successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  async currentUser(req, res, next) {
    try {
      if (!req.currentUser) throw new NotFound("User not found");
      const user = await userService.readById(req.currentUser.id);

      res.json({
        success: true,
        msg: "User retrieved successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  async readAll(req, res, next) {
    try {
      const { skip, take, search } = req.query;

      const { users, pagination } = await userService.readAll({
        skip: skip ? Number(skip) : undefined,
        take: take ? Number(take) : undefined,
        search: search ? String(search) : undefined,
      });
      if (!users) throw new NotFound("Users not found");
      res.json({
        success: true,
        msg: "Users retrieved successfully",
        data: users,
        pagination,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const updatedUser = await userService.update(req.params.id, req.body);

      res.json({
        success: true,
        msg: "User updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const deletedUser = await userService.delete(req.params.id);

      res.json({
        success: true,
        msg: "User deleted successfully",
        data: deletedUser,
      });
    } catch (error) {
      next(error);
    }
  },
};
