import { RequestHandler } from "express";
import { NotFound } from "http-errors";
import { notificationService } from "../services";

export const notificationController: {
  create: RequestHandler;
  readById: RequestHandler;
  readAll: RequestHandler;
  update: RequestHandler;
  delete: RequestHandler;
} = {
  async create(req, res, next) {
    try {
      const notification = await notificationService.create(req.body);

      res.json({
        success: true,
        msg: "Notification created successfully",
        data: notification,
      });
    } catch (error) {
      next(error);
    }
  },

  async readById(req, res, next) {
    try {
      const notification = await notificationService.readById(req.params.id);

      res.json({
        success: true,
        msg: "Notification retrieved successfully",
        data: notification,
      });
    } catch (error) {
      next(error);
    }
  },

  async readAll(req, res, next) {
    try {
      const { skip, take, search } = req.query;

      const { notifications, pagination } = await notificationService.readAll({
        skip: skip ? Number(skip) : undefined,
        take: take ? Number(take) : undefined,
        search: search ? String(search) : undefined,
      });
      if (!notifications) throw new NotFound("Notifications not found");
      res.json({
        success: true,
        msg: "Notifications retrieved successfully",
        data: notifications,
        pagination,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const updatedNotification = await notificationService.update(
        req.params.id,
        req.body
      );

      res.json({
        success: true,
        msg: "Notification updated successfully",
        data: updatedNotification,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const deletedNotification = await notificationService.delete(
        req.params.id
      );

      res.json({
        success: true,
        msg: "Notification deleted successfully",
        data: deletedNotification,
      });
    } catch (error) {
      next(error);
    }
  },
};
