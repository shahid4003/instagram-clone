import { Server } from "socket.io";
import { prisma } from "./config/db";

export const initSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: any) => {
    console.log("User connected:", socket.id);

    socket.on("send_message", async (data: any) => {
      try {
        const message = await prisma.message.create({
          data: {
            senderId: data.senderId,
            receiverId: data.receiverId,
            content: data.content,
            timestamp: new Date(),
          },
        });
        // Emit to specific receiver and sender
        io.to(data.receiverId).emit("receive_message", message);
        io.to(data.senderId).emit("receive_message", message);
      } catch (error) {
        console.error("Socket error:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
