const mongooose = require("mongoose");
const { Schema } = mongooose;

const CommentSchema = new Schema(
  {
    post_id: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    text_content: {
      type: String,
      required: [true, "Text comment is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongooose.model("Comment", CommentSchema);
