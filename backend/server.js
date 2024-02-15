import express from "express";
import mongoose from "mongoose";
import { postRoutes } from "./routes/postRoutes.js";
import { userRoutes } from "./routes/userRoutes.js";

const app = express();

app.use(express.json());

app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

mongoose
  .connect("mongodb://127.0.0.1:27017", { dbName: "demo_db" })
  .then(() => {
    console.log("Connected to Database");
    app.listen(process.env.PORT, () => {
      console.log("Server is running on port 4000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
