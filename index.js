import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import connectDB from "./mongodb/connect.js";

import postRoutes from "./routes/postRoutes.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "https://dall-e-clone-client.netlify.app",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: 'Content-Type, Authorization'
  })
);
app.use(express.json({ limit: "50mb" }));

app.use("/api/v1/post", postRoutes);


const startServer = async () => {
  try {
    await connectDB(process.env.MONGODB_URL);
  } catch (err) {
    if (err) throw err;
  }
  app.listen(process.env.PORT, () =>
    console.log(`Server has started on ${process.env.PORT}`)
  );
};

startServer();
