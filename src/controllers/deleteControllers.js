// Delete controller

const {
  checkIFUserIDValidQuery,
  removeFriendToMyListQuery,
} = require("../services/DBQuery");

// delete or remove friend from my list
module.exports.removeFriendFromMyListController = async (req, res) => {
  try {
    const { author, friend_id } = req.body;

    if (!author || !friend_id)
      return res.status(401).send("All field are required!");

    const authorID = await checkIFUserIDValidQuery({ author });
    const friendID = await checkIFUserIDValidQuery({ author: friend_id });

    if (authorID && friendID) {
      const remove = await removeFriendToMyListQuery({ author, friend_id });
      if (remove) {
        return res.status(401).send(remove);
      } else {
        return res
          .status(401)
          .send("Unable to remove friend, please try again later");
      }
    } else {
      return res.status(401).send("Invalid Author or Friends ID");
    }
  } catch (error) {
    return res.status(501).send("Error occure please try again later");
  }
};
