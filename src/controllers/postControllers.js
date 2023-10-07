// Post controllers

const {
  checkIfEmailExitQuery,
  createNewPostQuery,
  createNewUserQuery,
  createNewCommentQuery,
  checkIFUserIDValidQuery,
  checkIFPostIDValidQuery,
  sendMessageQuery,
  getMessageQery,
  makeReplyToCommentQuery,
  checkIFCommentIDValidQuery,
} = require("../services/DBQuery");
const { verifyPassword } = require("../utils/password");

// register routes
module.exports.registerUserController = async (req, res) => {
  try {
    const { fname, lname, email, password } = req.body;

    if (!fname || !lname || !email || !password) {
      return res.status(401).send("All field is required");
    }

    await checkIfEmailExitQuery({ email })
      .then(async () => {
        await createNewUserQuery({ fname, lname, email, password });
        return res.status(200).send("Account created");
      })
      .catch(() => {
        return res.status(401).send("Email already exit please login");
      });
  } catch (error) {
    return res.status(501).send("Error occure please try again later");
  }
};

// Login User controller

module.exports.loginUserController = async (req, res) => {
  try {
    const { email, password: pass } = req.body;
    if (!email || !pass) return res.status(401).send("All field is required");

    // check if email exit
    const mail = await checkIfEmailExitQuery({ email });
    if (mail) {
      // verify password
      const pin = await verifyPassword(pass, mail.password);
      if (pin) {
        // generate token
        await mail.generateToken();

        const { password, ...others } = mail._doc;
        return res.status(200).send(others);
      } else {
        return res.status(401).send("Invalid credentials");
      }
    } else {
      return res.status(401).send("Invalid credentials");
    }
  } catch (error) {
    console.log(error);
    return res.status(501).send("Error occure please try again later");
  }
};

// Create new post
module.exports.createPostController = async (req, res) => {
  try {
    const { author, content } = req.body;

    if (!author || !content)
      return res.status(401).send("All field is required!");

    // Validate the user ID
    const userID = await checkIFUserIDValidQuery({ author });
    if (userID) {
      const post_image = req.file.filename;
      const value = await createNewPostQuery({ author, content, post_image });
      if (value) return res.status(200).send(value);
      else return res.status(401).send("Error occure!");
    } else {
      return res.status(401).send("Invalid Author ID");
    }
  } catch (error) {
    console.log(error);
    return res.status(501).send("Error occure please try again later");
  }
};

// make new reply comment on a post
module.exports.createReplyCommentController = async (req, res) => {
  try {
    const { comment_id, author, comment_text } = req.body;

    if (!comment_id || !author || !comment_text)
      return res.status(401).send("All field is required");

    // check if the comment ID is valid
    const commentID = await checkIFCommentIDValidQuery({ comment_id });
    // check if the user ID is valid
    const userID = await checkIFUserIDValidQuery({ author });
    if (commentID && userID) {
      const value = await makeReplyToCommentQuery({
        comment_id,
        author,
        comment_text,
      });

      if (value) return res.status(200).send(value);
      else return res.status(401).send("Error occure!");
    } else {
      return res.status(401).send("Invalid Comment ID or Author ID");
    }
  } catch (error) {
    console.log(error);
    return res.status(501).send("Error occure please try again later");
  }
};

// make new comment on a post
module.exports.createCommentController = async (req, res) => {
  try {
    const { post_id, author, text_content } = req.body;

    if (!post_id || !author || !text_content)
      return res.status(401).send("All field is required");

    // check if the post ID is valid
    const postID = await checkIFPostIDValidQuery({ post_id });
    // check if the user ID is valid
    const userID = await checkIFUserIDValidQuery({ author });
    if (postID && userID) {
      const value = await createNewCommentQuery({
        post_id,
        author,
        text_content,
      });

      if (value) return res.status(200).send(value);
      else return res.status(401).send("Error occure!");
    } else {
      return res.status(401).send("Invalid Post ID or Author ID");
    }
  } catch (error) {
    return res.status(501).send("Error occure please try again later");
  }
};

// send message controller
module.exports.sendMessageController = async (req, res) => {
  try {
    const { from, to, message } = req.body;

    if (!from || !to || !message)
      return res.status(401).send("All field are required!");

    // check if from and to ID's are valid

    const fromID = await checkIFUserIDValidQuery({ author: from });
    const toID = await checkIFUserIDValidQuery({ author: to });

    if (fromID && toID) {
      const saveMessage = await sendMessageQuery({ from, to, message });
      if (saveMessage) {
        return res.status(200).send("Message sent!");
      } else {
        return res
          .status(401)
          .send(
            "Error occure, unable to complete your request please try again later"
          );
      }
    } else {
      return res.status(401).send("Invalid From or To ID");
    }
  } catch (error) {
    return res.status(501).send("Error occure please try again later");
  }
};

// get messages controller
module.exports.getMessagesController = async (req, res) => {
  try {
    const { from, to } = req.body;
    if (!from || !to) return res.status(401).send("All field are required!");

    const fromID = await checkIFUserIDValidQuery({ author: from });
    const toID = await checkIFUserIDValidQuery({ author: to });

    if (fromID && toID) {
      const message = await getMessageQery({ from, to });
      if (message) {
        return res.status(200).send(message);
      } else {
        return res
          .status(401)
          .send(
            "Error occure, unable to complete your request please try again later"
          );
      }
    } else {
      return res.status(401).send("Invalid From or To ID");
    }
  } catch (error) {
    return res.status(501).send("Error occure please try again later");
  }
};
