import { Prisma } from "@prisma/client";
import { prisma } from "../configs";

interface GetOptions {
  skip?: number;
  take?: number;
  search?: string;
  userId?: string;
  isRead?: boolean;
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
    const { skip, take, search, isRead, userId } = options;

    let where: Prisma.NotificationWhereInput = {};

    if (search) {
      where = {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { body: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    // Add the condition to filter by isRead (if provided)
    if (isRead !== undefined) {
      where.isRead = isRead; // Convert isRead to a boolean
    }

    // Add the condition to filter by userId (if provided)
    if (userId) {
      where.userId = userId;
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

  async deleteAll() {
    // Delete all notifications
    const deletedNotifications = await prisma.notification.deleteMany({});
    return deletedNotifications;
  },

  async sendToMultipleUsers(
    userIds: string[],
    input: Prisma.NotificationCreateInput,
    sendAll?: boolean
  ) {
    let selectedUserIds = userIds;
    if (sendAll) {
      selectedUserIds = (
        await prisma.user.findMany({ select: { id: true } })
      ).map((_) => _.id);
    }
    // Create notifications and associate them with multiple users
    const notifications = await Promise.all(
      selectedUserIds.map(async (userId) => {
        const notification = await prisma.notification.create({
          data: {
            ...input,
            user: { connect: { id: userId } },
          },
        });
        return notification;
      })
    );
    return notifications;
  },
};
