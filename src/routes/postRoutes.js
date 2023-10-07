// Post routes

const {
  registerUserController,
  loginUserController,
  createPostController,
  createCommentController,
  sendMessageController,
  getMessagesController,
  createReplyCommentController,
} = require("../controllers/postControllers");
const { uploads } = require("../middlewares/uploadPicture");

const postRouter = require("express").Router();

// Register
postRouter.post("/register", registerUserController);

// Login
postRouter.post("/login", loginUserController);

// create post
postRouter.post(
  "/create/new/post",
  uploads.single("image"),
  createPostController
);

// Make comment on a post route
postRouter.post("/create/comment", createCommentController);

// Make reply on a comment route
postRouter.post("/reply/comment", createReplyCommentController);

// Send message routes
postRouter.post("/send/message", sendMessageController);

// get messages
postRouter.post("/get/message", getMessagesController);

module.exports = postRouter;
