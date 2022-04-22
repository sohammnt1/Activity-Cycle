import express from "express";
import { checkAdmin } from "./utility/checkadmin";
import { mongoConnection } from "./connections/connect.mongo";
import { registerRoutes } from "./routes";

export const startServer = async () => {
  try {
    const app = express();

    await mongoConnection();
    await checkAdmin();

    registerRoutes(app);
    const { PORT } = process.env;

    app.listen(PORT);
    {
      console.log(`App Started on port ${PORT}`);
    }
  } catch (e) {
    console.log("Failed to start server");
    process.exit(1);
  }
};
