const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
const validationErrorMsgs = require("../config/validationErrorMsgs");

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, validationErrorMsgs.TITLE_REQUIRED],
      maxLength: [100, validationErrorMsgs.TITLE_MAX_LENGTH],
      unique: [true, validationErrorMsgs.TITLE_UNIQUE],
    },
    description: {
      type: String,
      maxLength: [300, validationErrorMsgs.DESCRIPTION_MAX_LENGTH],
    },
    status: {
      type: String,
      required: [true, validationErrorMsgs.STATUS_REQUIRED],
      enum: {
        values: ["pending", "complete"],
        message: validationErrorMsgs.STATUS_INVALID,
      },
    },
    username: {
      type: String,
      required: [true, validationErrorMsgs.USERNAME_REQUIRED],
    },
  },
  {
    collection: "tasks",
    timestamps: true,
  }
);

taskSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Task", taskSchema);
