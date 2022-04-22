import { Schema, model, connect } from "mongoose";

export const mongoConnection = async (): Promise<void> => {
  try {
    const { MONGO_CONNECTION_USER } = process.env;
    await connect(MONGO_CONNECTION_USER!);
    console.log("Mongo Connected");
  } catch (e) {
    throw { message: "Could Not connect to mongo db" };
  }
};
