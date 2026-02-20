import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { authenticate } from "./middlewares/Authenticator.js";
import routes from "./routes.js";
import { initSocket } from "./socket.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

const server = http.createServer(app);
initSocket(server);

app.use("/api", authenticate);
app.use("/api", routes);

server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
