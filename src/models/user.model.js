const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
const validationErrorMsgs = require("../config/validationErrorMsgs");

const passwordRegex = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/
);
const emailRegex = new RegExp(
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
);
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, validationErrorMsgs.USERNAME_REQUIRED],
      unique: true,
      maxLength: [20, validationErrorMsgs.USERNAME_MAX_LENGTH],
      minLength: [3, validationErrorMsgs.USERNAME_MIN_LENGTH],
      trim: true,
    },
    email: {
      type: String,
      required: [true, validationErrorMsgs.EMAIL_REQUIRED],
      match: [emailRegex, validationErrorMsgs.EMAIL_INVALID],
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, validationErrorMsgs.PASSWORD_REQUIRED],
      validate: {
        validator: function (value) {
          const minLength = 7;
          if (value.length < minLength) {
            return false;
          }
          return passwordRegex.test(value);
        },
        message: function (props) {
          if (props.value.length < 7) {
            return validationErrorMsgs.PASSWORD_MIN_LENGTH;
          }
          return validationErrorMsgs.PASSWORD_MUST_HAVE_CHARACTERS;
        },
      },
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
