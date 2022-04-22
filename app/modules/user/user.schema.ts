import { Schema, model, Types } from "mongoose";

class userSchema extends Schema {
  constructor() {
    super(
      {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: {
          type: Types.ObjectId,
          required: true,
          ref: "role",
          default: "625e36c0be9bb54da8934ee2",
        },
        forgotPasswordToken: { type: String, required: false },
        tokenExpiry: { type: Number, required: false },
        isBlocked: { type: Boolean, required: true, default: false },
        status: {
          type: Types.ObjectId,
          required: true,
          default: "625e5b75be9bb54da8934ef6",
        },
        cycles: [
          {
            cycle: [
              {
                cycleStart: { type: Number, required: true },
                cycleEnd: { type: Number, required: true },
                tasks: [
                  {
                    taskid: {
                      type: Types.ObjectId,
                      required: true,
                      ref: "tasks",
                    },
                    status: {
                      type: Types.ObjectId,
                      required: true,
                      ref: "taskstatus",
                      default: "625e5b75be9bb54da8934ef6",
                    },
                    CertificateURl: {
                      type: String,
                      required: false,
                      default: null,
                    },
                    CertificationDate: {
                      type: Date,
                      required: false,
                      default: null,
                    },
                  },
                ],
              },
            ],
          },
        ],
        deleted: { type: Boolean, required: true, default: false },
      },
      {
        timestamps: true,
      }
    );
  }
}

const userModel = model("user", new userSchema());

export default userModel;
