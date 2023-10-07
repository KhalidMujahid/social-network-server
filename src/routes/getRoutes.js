const {
  getAllPostController,
  getAllUsersController,
  getProfileController,
  getMessagesController,
  loginUserTokenController,
  getSinglePostController,
  getSelectedPostCommentController,
  getSingleCommentController,
  getCommentController,
  getMyFriendController,
} = require("../controllers/getControllers");
const { verifyToken } = require("../middlewares/authorizedUser");

const getRouter = require("express").Router();

// Get all Posts from DB
getRouter.get("/posts", getAllPostController);

// Get all Users from DB
getRouter.get("/users", getAllUsersController);

// view profile
getRouter.get("/profile/:id", getProfileController);

// get single post
getRouter.get("/post/:id", getSinglePostController);

// get single author comment
getRouter.get("/author/comment/:id", getSingleCommentController);

// get single comment related with the author
getRouter.get("/comment/:id", getCommentController);

// get my chat list
getRouter.get("/my/friend/:id", getMyFriendController);

// login user with token
getRouter.get("/login/token", verifyToken, loginUserTokenController);

module.exports = getRouter;
