import { Schema, model, Types } from "mongoose";

class taskCategorySchema extends Schema {
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

const taskCategoryModel = model("taskcategories", new taskCategorySchema());

export default taskCategoryModel;
