const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    fname: {
      type: String,
      trim: true,
      required: [true, "First name is required"],
    },
    lname: {
      type: String,
      trim: true,
      required: [true, "Last name is required"],
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Email is required"],
    },
    profile_image: {
      type: String,
      default: "default.jpeg",
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
    },
  },
  { timestamps: true }
);

// generate token
UserSchema.methods.generateToken = async function () {
  const token = jwt.sign({ _id: this.id.toString() }, process.env.MY_SECRET);
  this.token = token;
  await this.save();
  return token;
};

module.exports = mongoose.model("User", UserSchema);
