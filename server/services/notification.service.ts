import { Prisma } from "@prisma/client";
import { admin, prisma } from "../configs";

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

    // Get the FCM tokens of the user receiving the notification
    const userTokens = await prisma.user.findMany({
      where: { id: input.id }, // Assuming the user ID is stored in input.userId
      select: { fcmToken: true },
    });

    const tokens = userTokens.map(({ fcmToken }) => [
      fcmToken?.android,
      fcmToken?.ios,
      fcmToken?.web,
    ]);

    // Flatten the tokens array and remove any undefined or null values
    const validTokens = tokens?.flat().filter((token) => !!token) as string[];

    if (validTokens.length === 0) {
      // No valid FCM tokens to send a notification
      return notification;
    }

    const payload = {
      notification: {
        title: input.title,
        body: input.body,
      },
      data: {
        title: input.title,
        body: input.body,
      },
    };

    // Send a multicast notification to all valid tokens
    const response = await admin.messaging().sendMulticast({
      tokens: validTokens,
      notification: payload.notification,
      data: payload.data,
    });

    // Handle the response if needed
    response.responses.forEach((result, index) => {
      if (result.error) {
        console.error(
          `Failed to send notification to user with token ${validTokens[index]}: ${result.error}`
        );
        // Handle the error as needed
      } else {
        console.log(
          `Notification sent to user with token ${validTokens[index]}`
        );
        // Handle the success as needed
      }
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

  async deleteAll({
    userIds,
    notificationIds,
    removeReadData,
  }: {
    userIds?: string[];
    notificationIds?: string[];
    removeReadData?: boolean;
  } = {}) {
    let where: Prisma.NotificationWhereInput = {};

    if (userIds) {
      where = {
        user: { id: { in: userIds } },
      };
    }

    if (notificationIds) {
      where = {
        ...where,
        id: { in: notificationIds },
      };
    }

    if (removeReadData !== undefined) {
      where = {
        ...where,
        isRead: removeReadData,
      };
    }

    // Delete matching notifications
    const deletedNotifications = await prisma.notification.deleteMany({
      where,
    });

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
      ).map((user) => user.id);
    }

    const notifications = await Promise.all(
      selectedUserIds.map(async (userId) => {
        const notification = await prisma.notification.create({
          data: {
            ...input,
            user: { connect: { id: userId } },
          },
        });

        // Get the FCM token of the user receiving the notification
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { fcmToken: true },
        });

        if (user && user.fcmToken) {
          const validTokens = [
            user.fcmToken.android,
            user.fcmToken.ios,
            user.fcmToken.web,
          ].filter((token) => !!token) as string[];

          if (validTokens.length > 0) {
            const payload = {
              notification: {
                title: input.title,
                body: input.body,
              },
              data: {
                title: input.title,
                body: input.body,
              },
            };

            const response = await admin.messaging().sendMulticast({
              tokens: validTokens,
              notification: payload.notification,
              data: payload.data,
            });

            response.responses.forEach((result, index) => {
              if (result.error) {
                console.error(
                  `Failed to send notification to user ${userId} with token ${validTokens[index]}: ${result.error}`
                );
                // Handle the error as needed
              } else {
                console.log(
                  `Notification sent to user ${userId} with token ${validTokens[index]}`
                );
                // Handle the success as needed
              }
            });
          }
        }

        return notification;
      })
    );

    return notifications;
  },
};
