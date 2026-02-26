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
app.use(
  cors({
    origin: [
      "http://13.61.209.150",
      "http://localhost:5173"
    ],
    credentials: true
  })
);

const server = http.createServer(app);
initSocket(server);

app.use("/api", (req: any, res: any, next: any) => {
  const publicRoutes = ["/auth/signup", "/auth/login", "/auth/logout"];
  const isPublicRoute = publicRoutes.some((route) => req.path.startsWith(route));

  if (isPublicRoute) {
    return next();
  }

  authenticate(req, res, next);
});

app.use("/api", routes);

server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
