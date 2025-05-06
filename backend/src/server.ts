import express from "express";
import cors from "cors";
import "./config/loadEnvironment";
import connectDB from "./config/dbConfig";
import authRoutes from "./routes/auth.routes";
import friendsRoutes from "./routes/friends.routes";
import postsRoutes from "./routes/posts.routes";
import commentsRoutes from "./routes/comments.routes";
import { errorMiddleware, notFoundMiddleware } from './middleware/error.middleware';

const PORT = process.env.PORT || 3000;
const app = express();

connectDB();

app.use(express.json({ extended: true } as object));
app.use(cors());

app.get("/", (_, res) => {
  res.status(200).json({ status: "Server is running..." });
});

app.use("/api/", authRoutes);
app.use("/api/friends/", friendsRoutes);
app.use("/api/posts/", postsRoutes);
app.use("/api/comments/", commentsRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

app
  .listen(PORT, () => {
    console.log(`
    ################################################
    🛡️  Server listening on port: ${PORT} 🛡️
    ################################################
  `);
  })
  .on("error", (err) => {
    console.error(err);
    process.exit(1);
  });



// "dev": "NODE_ENV=development nodemon",