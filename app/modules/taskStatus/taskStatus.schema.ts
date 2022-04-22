import { Schema, model, Types } from "mongoose";

class taskStatusSchema extends Schema {
  constructor() {
    super(
      {
        name: { type: String, required: true },
      },
      {
        timestamps: true,
      }
    );
  }
}

const taskStatusModel = model("taskstatus", new taskStatusSchema());

export default taskStatusModel;
