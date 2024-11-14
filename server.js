import express from "express";
import adminRoutes from "./routes/adminRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import photoRoutes from "./routes/photoRoutes.js";
import podcastRoutes from "./routes/podcastRoutes.js";
// import registrationRoutes from "./routes/registrationRoutes.js";
import { logging } from "./middlewares/logger.js";
import errorHandler from "./errors/errorHandler.js";
import { ClientError, ServerError } from "./errors/ApiError.js";
import { fileURLToPath } from "url";
import path from "path";
import database from "./database.js";

import dotenv from "dotenv";
dotenv.config();

let app = express();

app.use(logging);
app.use("/admin", adminRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/podcasts", podcastRoutes);
//app.use("/api/registrations", registrationRoutes);

// TODO: @cosmic-striker Increase Security
app.use("/if/you/get/these/images/you/are/gay", photoRoutes);

app.get("/", (req, res) =>
  res.sendFile("index.html", {
    root: path.dirname(fileURLToPath(import.meta.url)),
  })
);

app.use((req, res) => {
  throw ClientError.notFound();
});

// Centralized Error Handler
app.use(errorHandler);

const server = app.listen(3000, () => {
  console.log("Server started on port 3000");
});

const cleaner = () => {
  server.close(async () => {
    (await database()).close();
  });
};

process.on("SIGINT", cleaner);
process.on("SIGTERM", cleaner);
process.on("uncaughtException", (error) => {
  console.error(
    "Uncaught Exception:",
    error instanceof Error ? error.message : String(error)
  );
  cleaner();
});
process.on("unhandledRejection", (error) => {
  console.error(
    "Unhandled Rejection:",
    error instanceof Error ? error.message : String(error)
  );
  cleaner();
});
