import { Schema, model, Types } from "mongoose";

class taskSchema extends Schema {
  constructor() {
    super(
      {
        name: { type: String, required: true },
        isOptional: { type: Boolean, required: true, default: false },
        cycle: { type: Number, required: true },
        taskCategory: {
          type: Types.ObjectId,
          required: true,
          ref: "taskcategories",
        },
      },
      {
        timestamps: true,
      }
    );
  }
}

const taskModel = model("tasks", new taskSchema());

export default taskModel;
