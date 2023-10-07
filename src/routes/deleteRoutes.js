// Delete routes
const deleteRouter = require("express").Router();

const {
  removeFriendFromMyListController,
} = require("../controllers/deleteControllers");

deleteRouter.delete("/remove/friend", removeFriendFromMyListController);

module.exports = deleteRouter;
