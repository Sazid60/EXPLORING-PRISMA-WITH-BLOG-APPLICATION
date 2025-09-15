
import express, { Request, Response } from "express"
import compression from "compression";
import cors from "cors";

import { postRouter } from "./modules/post/post.routes";
import { UserRouter } from "./modules/user/user.routes";


const app = express()

app.use(cors()); // Enables Cross-Origin Resource Sharing
app.use(compression()); // Compresses response bodies for faster delivery
app.use(express.json()); // Parse incoming JSON requests

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/v1/user", UserRouter);
app.use("/api/v1/post", postRouter) // added the route

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome To The App"
    })
})

app.use((req: Request, res:Response) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

export default app