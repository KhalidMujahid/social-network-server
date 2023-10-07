const {
  saveProfileImageInUserSchemaQuery,
  checkIFUserIDValidQuery,
  checkIFPostIDValidQuery,
  addOrRemoveLikeFromAPostQuery,
  addFriendToMyListQuery,
} = require("../services/DBQuery");

// update profile picture controller
module.exports.createProfilePictureController = async (req, res) => {
  try {
    const { author } = req.params;

    const userID = await checkIFUserIDValidQuery({ author });
    if (userID) {
      const info = await saveProfileImageInUserSchemaQuery({
        id: author,
        file: req.file.filename,
      });
      if (info) {
        return res.status(200).send(info);
      } else {
        return res.status(401).send("Error occure");
      }
    } else {
      return res.status(401).send("Invalid Author ID");
    }
  } catch (error) {
    return res.status(501).send("Error occure please try again later");
  }
};

// Like or unlike a post
module.exports.updateLikesOnAPostController = async (req, res) => {
  try {
    const { author, post_id } = req.body;

    if (!author || !post_id)
      return res.status(401).send("All field are required!");

    // validation of both author and post id
    const userID = await checkIFUserIDValidQuery({ author });
    const postID = await checkIFPostIDValidQuery({ post_id });

    if (userID && postID) {
      const love = await addOrRemoveLikeFromAPostQuery({ author, post_id });
      if (love) {
        return res.status(200).send("1");
      } else {
        return res.status(200).send("0");
      }
    } else {
      return res.status(401).send("Invalid User or Post ID");
    }
  } catch (error) {
    return res.status(501).send("Error occure please try again later");
  }
};

// Add friends send friend request
module.exports.addFriendToMyListController = async (req, res) => {
  try {
    const { author, friend_id } = req.body;

    if (!author || !friend_id)
      return res.status(401).send("All field are required!");

    const authorID = await checkIFUserIDValidQuery({ author });
    const friendID = await checkIFUserIDValidQuery({ author: friend_id });

    if (authorID && friendID) {
      const add = await addFriendToMyListQuery({ author, friend_id });
      if (add) {
        return res.status(200).send(add);
      } else {
        return res
          .status(401)
          .send(`${friendID.fname} is already in your list!`);
      }
    } else {
      return res.status(401).send("Invalid Author or Friends ID");
    }
  } catch (error) {
    return res.status(501).send("Error occure please try again later");
  }
};
