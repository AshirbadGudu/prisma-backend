import { Prisma } from "@prisma/client";
import { prisma } from "../configs";

interface GetOptions {
  skip?: number;
  take?: number;
  search?: string;
}

export const notificationService = {
  // CRUD
  async create(input: Prisma.NotificationCreateInput) {
    const notification = await prisma.notification.create({
      data: input,
    });
    return notification;
  },
  async readAll(options: GetOptions = {}) {
    const { skip, take, search } = options;

    let where: Prisma.NotificationWhereInput = {};

    if (search) {
      where = {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { body: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    let notifications;
    let total;

    // Check if both skip and take options are provided for pagination
    if (skip !== undefined && take !== undefined) {
      notifications = await prisma.notification.findMany({
        where,
        skip,
        take,
      });

      total = await prisma.notification.count({ where });
    } else {
      // If skip or take is not provided, fetch all data without pagination
      notifications = await prisma.notification.findMany({
        where,
      });

      total = notifications.length;
    }

    return {
      notifications,
      pagination: { skip, take, total },
    };
  },

  async update(id: string, data: Prisma.NotificationUpdateInput) {
    const isNotificationExists = await prisma.notification.findUnique({
      where: { id },
    });
    if (!isNotificationExists) throw new Error("Notification not found!");
    const updatedNotification = await prisma.notification.update({
      where: { id },
      data,
    });
    return updatedNotification;
  },
  async delete(id: string) {
    const isNotificationExists = await prisma.notification.findUnique({
      where: { id },
    });
    if (!isNotificationExists) throw new Error("Notification not found!");
    const deletedNotification = await prisma.notification.delete({
      where: { id },
    });
    return deletedNotification;
  },
  async readById(id: string) {
    const notification = await prisma.notification.findUnique({
      where: { id },
    });
    return notification;
  },
};
