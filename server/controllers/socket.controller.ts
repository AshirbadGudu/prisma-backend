import { Server } from "http";
import { Socket, Server as SocketIOServer } from "socket.io";
import { prisma } from "../configs";

export function socketController(server: Server) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log(`Socket ${socket.id} connected`);

    // Send a message to the connected client
    socket.emit("message", "Welcome to the server!");

    // Listen for a custom event from the client
    socket.on("makeOnline", (data: any) => {
      if (!JSON.parse(data)?.id) return;
      socket.data = {
        userId: JSON.parse(data)?.id,
      };
      prisma.user
        .update({
          where: { id: JSON.parse(data)?.id },
          data: { isOnline: true },
          select: { isOnline: true, id: true, email: true },
        })
        .then((response) => console.log(response))
        .catch((error) => console.log(error));
    });

    // Handle disconnection
    socket.on("disconnect", (reason) => {
      if (typeof socket.data?.userId === "string")
        prisma.user
          .update({
            where: { id: socket.data?.userId },
            data: { isOnline: false },
            select: { isOnline: true, id: true, email: true },
          })
          .then((response) => console.log(response))
          .catch((error) => console.log(error));
      console.log(`Socket ${socket.id} disconnected due to ${reason}`);
    });
  });
}
