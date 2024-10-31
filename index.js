import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import connectDB from "./mongodb/connect.js";
import postRoutes from "./routes/postRoutes.js";
import fileUpload from "express-fileupload";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type, Authorization",
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(
  fileUpload({
    limits: { fileSize: 500 * 1024 * 1024 },
  })
);
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
