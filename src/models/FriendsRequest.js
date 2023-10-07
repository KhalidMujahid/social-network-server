const mongoose = require("mongoose");

const { Schema } = mongoose;

const FreindRequestSchema = new Schema(
  {
    reciver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requester: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FreindRequest", FreindRequestSchema);
