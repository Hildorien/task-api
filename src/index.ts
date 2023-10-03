import express from "express";
import { createServer } from "http";
import * as routes from "./controller/routes";
import config from "../config/config";
import cors from 'cors';
import { TaskService } from "./service/task/task";

const app = express();
const server = createServer(app);
app.use(cors());
app.use(express.json()); // for parsing application/json

// Configure routes
app.use(routes.router);

// Init app
server.listen(config.port, async () => {
  try {
    await TaskService.initialize(config.connection);
    console.log(
      `Server started on port ${config.port} with env set to ${config.environment}`,
    );
  } catch (error: any) {
    process.exit(1);
  }
});
