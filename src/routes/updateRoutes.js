// Update routes
const updateRouter = require("express").Router();
const { uploads } = require("../middlewares/uploadPicture");
const {
  createProfilePictureController,
  updateLikesOnAPostController,
  addFriendToMyListController,
} = require("../controllers/updateControllers");

// Upload/update profile picture
updateRouter.put(
  "/upload/profile/:author",
  uploads.single("image"),
  createProfilePictureController
);

// like or dislike a post
updateRouter.put("/like", updateLikesOnAPostController);

// add friend to list
updateRouter.put("/add/friend", addFriendToMyListController);

module.exports = updateRouter;
