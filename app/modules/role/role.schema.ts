import { Schema, model, Types } from "mongoose";

class roleSchema extends Schema {
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

const roleModel = model("role", new roleSchema());

export default roleModel;
