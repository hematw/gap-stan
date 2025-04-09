import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server as IOServer } from "socket.io";
import cors from "cors";

dotenv.config();

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",");

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Welcome to the chat app API!");
});


const server = http.createServer(app);
const io = new IOServer(server, {
  cors: { origin: allowedOrigins || ["http://localhost:5173"] },
  credentials: true,
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("message", (msg) => {
    console.log("Message received:", msg);
    io.emit("message", msg); // Broadcast to all
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app listening on port ${port}!✅`);
});
