const mongoose = require("mongoose");
const { Schema }  = mongoose;

const ReplyCommentSchema = new Schema({
	comment_id: {
		type: Schema.Types.ObjectId,
		ref:"Comment"
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: "User"
	},
	comment_text: {
		type: String,
		required: true,
		tirm: true
	}
}, { timestamps: true });

module.exports = mongoose.model("ReplyComment",ReplyCommentSchema);