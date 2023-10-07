const {
  getAllPostQuery,
  getAllUserQuery,
  fetchProfileDetailsQuery,
  checkIFUserIDValidQuery,
  getMessageQery,
  fetchSinglePostQuery,
  fetchCommentQuery,
  fetchSingleCommentQuery,
  fetchSingleCommentReplieQuery,
  fetchChatListQuery,
} = require("../services/DBQuery");

// login user with token
module.exports.loginUserTokenController = async (req, res) => {
  try {
    if (req.auth) {
      const { auth } = req;
      return res.status(200).send(auth);
    } else {
      return res.status(401).send("Error occure please try again later");
    }
  } catch (error) {
    return res.status(501).send("Error occure please try again later");
  }
};

// get all post from DB
module.exports.getAllPostController = async (req, res) => {
  try {
    const posts = await getAllPostQuery();
    return res.status(200).send(posts);
  } catch (error) {
    return res.status(501).send("Error occure please try again later");
  }
};

//get all User from DB
module.exports.getAllUsersController = async (req, res) => {
  try {
    const users = await getAllUserQuery();
    return res.status(200).send(users);
  } catch (error) {
    return res.status(501).send("Error occure please try again later");
  }
};

// View profile
module.exports.getProfileController = async (req, res) => {
  try {
    const { id } = req.params;

    // verify the user id
    const user = await checkIFUserIDValidQuery({ author: id });
    if (user) {
      const info = await fetchProfileDetailsQuery({ id });
      if (info) {
        const { password, ...others } = info._doc;
        return res.status(200).send(others);
      } else {
        return res
          .status(401)
          .send("Unable to fetch user profile, please try again later");
      }
    } else {
      return res.status(401).send("Invalid User ID");
    }
  } catch (error) {
    return res.status(501).send("Error occure please try again later");
  }
};

// get single post
module.exports.getSinglePostController = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await fetchSinglePostQuery({ id });
    if (post) {
      return res.status(200).send(post);
    } else {
      return res.status(401).send("Error occure please try again later");
    }
  } catch (error) {
    return res.status(501).send("Error occure please try again later");
  }
};

// get single post comment replies
module.exports.getCommentController = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await fetchSingleCommentReplieQuery({ id });
    if (comment) {
      return res.status(200).send(comment);
    } else {
      return res.status(401).send("Error occure please try again later");
    }
  } catch (error) {
    return res.status(501).send("Error occure please try again later");
  }
};

// get single comment replies
module.exports.getSingleCommentController = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await fetchSingleCommentQuery({ id });
    if (comment) {
      return res.status(200).send(comment);
    } else {
      return res.status(401).send("Error occure please try again later");
    }
  } catch (error) {
    return res.status(501).send("Error occure please try again later");
  }
};

// get my friends
module.exports.getMyFriendController = async (req, res) => {
  try {
    const { id } = req.params;

    const chatlist = await fetchChatListQuery({ id });
    if (chatlist) {
      return res.status(200).send(chatlist);
    } else {
      return res.status(401).send("Error occure please try again later");
    }
  } catch (error) {
    console.log(error);
    return res.status(501).send("Error occure please try again later");
  }
};
