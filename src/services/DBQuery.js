// Database query methods
const Comment = require("../models/Comment");
const ReplyComment = require("../models/ReplyComment");
const Image = require("../models/Image");
const Post = require("../models/Post");
const User = require("../models/User");
const Message = require("../models/Messages");
const { generateHash } = require("../utils/password");
const Friends = require("../models/Friends");

// replies for comment
module.exports.makeReplyToCommentQuery = async ({
  comment_id,
  author,
  comment_text,
}) => {
  const createReplyComment = new ReplyComment({
    author,
    comment_id,
    comment_text,
  });
  await createReplyComment.save();
  return createReplyComment;
};

// send message
module.exports.sendMessageQuery = async ({ from, to, message }) => {
  const createMessage = new Message({
    sender: from,
    members: [from, to],
    message,
  });

  await createMessage.save();
  return createMessage;
};

// get messages
module.exports.getMessageQery = async ({ from, to }) => {
  const getMessage = await Message.find({
    members: { $all: [from, to] },
  }).sort({
    updatedAt: 1,
  });

  const projectedMessages = getMessage.map((msg) => {
    return {
      me: msg.sender.toString() === from,
      message: msg.message,
      created: msg.createdAt,
    };
  });
  return projectedMessages;
};

// check if email exits
module.exports.checkIfEmailExitQuery = async ({ email }) => {
  const mail = await User.findOne({ email });
  if (mail) return mail.populate("friends");
  else return false;
};

// verify if user ID is valid
module.exports.checkIFUserIDValidQuery = async ({ author }) => {
  const user = await User.findById({ _id: author });
  if (user) return user;
  else return false;
};

// add or remove like(love ) from a post
module.exports.addOrRemoveLikeFromAPostQuery = async ({ post_id, author }) => {
  const post = await Post.findById({ _id: post_id });
  if (!post.loves.includes(author)) {
    const updatePost = await Post.findOneAndUpdate(
      { _id: post_id },
      { $push: { loves: author } },
      { new: true }
    );
    return updatePost;
  } else {
    const updatePost = await Post.findOneAndUpdate(
      { _id: post_id },
      { $pull: { loves: author } },
      { new: true }
    );
    return updatePost;
  }
};

// verify if post ID is valid
module.exports.checkIFPostIDValidQuery = async ({ post_id }) => {
  const post = await Post.findById({ _id: post_id });
  if (post) return true;
  else return false;
};

// verify if comment ID is valid
module.exports.checkIFCommentIDValidQuery = async ({ comment_id }) => {
  const comment = await Comment.findById(comment_id);
  if (comment) return true;
  else return false;
};

//Create new user
module.exports.createNewUserQuery = async ({
  fname,
  lname,
  email,
  password,
}) => {
  const hashPassword = await generateHash(password);
  if (hashPassword) {
    const user = new User({
      fname,
      lname,
      email,
      password: hashPassword,
    });

    await user.save();
    return user;
  }
};

// Create new post
module.exports.createNewPostQuery = async ({ author, content, post_image }) => {
  const newPost = new Post({
    author,
    content,
    post_image,
  });

  newPost.save(async (data) => {
    // Find the user by his/her ID to update the post array
    const user = await User.findOne({ _id: author });
    await user.updateOne({
      $push: { posts: newPost._id },
    });
  });
  return newPost.populate("author", "fname lname email profile_image");
};

//Create comment by user
module.exports.createNewCommentQuery = async ({
  post_id,
  author,
  text_content,
}) => {
  const newComment = new Comment({
    post_id,
    author,
    text_content,
  });

  newComment.save(async (data) => {
    // find the the post by it id to update the comment array
    const post = await Post.findById({ _id: post_id });
    await post.updateOne({
      $push: { comments: newComment._id },
    });
  });

  return newComment.populate("author", "fname lname profile_image");
};

// Get all post from DB
module.exports.getAllPostQuery = async () => {
  const posts = await Post.find().sort({ updatedAt: -1 }).populate("author");
  return posts;
};

// Get all users from DB
module.exports.getAllUserQuery = async () => {
  const posts = await User.find()
    .sort({ updatedAt: -1 })
    .select("fname lname email profile_image friends");
  return posts;
};

// Save profile image in the user Schema
module.exports.saveProfileImageInUserSchemaQuery = async (author) => {
  const user = await User.findOneAndUpdate(
    { _id: author.id },
    {
      $set: { profile_image: author.file },
    },
    { new: true }
  );

  return user;
};

// get my friends list (chat list)

module.exports.fetchChatListQuery = async (ids) => {
  const chatlist = await Friends.find({ owner: ids.id })
    .sort({ updatedAt: -1 })
    .populate("friend");
  if (chatlist) return chatlist;
  else return false;
};

// send friend request

module.exports.addFriendToMyListQuery = async (ids) => {
  const friend = new Friends({
    owner: ids.author,
    friend: ids.friend_id,
  });

  await friend.save();

  if (friend) return friend;
  else return false;
};

// remove friend to my list

module.exports.removeFriendToMyListQuery = async (ids) => {
  const user = await User.findById({ _id: ids.author });
  if (user.friends.includes(ids.friend_id)) {
    // remove author to the friend array
    // await User.findOneAndUpdate(
    //   { _id: ids.friend_id },
    //   {
    //     $pull: { friends: ids.author },
    //   },
    //   { new: true }
    // );

    // Add friend to the author array
    const updatedUser = await User.findOneAndUpdate(
      { _id: ids.author },
      {
        $pull: { friends: ids.friend_id },
      },
      { new: true }
    );

    return updatedUser;
  } else {
    return false;
  }
};

// fetch profile details
module.exports.fetchProfileDetailsQuery = async ({ id }) => {
  const user = await User.findById({ _id: id })
    .populate("posts")
    .populate("friends", "fname lname email profile_image friends posts");
  return user;
};

// get single post and it comments
module.exports.fetchSinglePostQuery = async ({ id }) => {
  const post = await Post.findById(id)
    .populate("author", "fname lname email profile_image post_image")
    .populate({
      path: "comments",
      populate: { path: "author", select: " fname lname email profile_image" },
    });
  return post;
};

// get single comment and it author
module.exports.fetchSingleCommentReplieQuery = async ({ id }) => {
  const repliescomment = await ReplyComment.find({ comment_id: id }).populate(
    "author",
    "fname lname email profile_image post_image"
  );
  return repliescomment;
};

// get single comment replies
module.exports.fetchSingleCommentQuery = async ({ id }) => {
  const comment = await Comment.findById(id).populate(
    "author",
    "fname lname email profile_image post_image"
  );
  return comment;
};

//
// async function gb(){
//   // const post = await Post.findById("62afbd218fa7ac766ca4f63c").populate("comments").populate("author")
//   const post = await Post.findById("62afbd218fa7ac766ca4f63c")
//   .populate("author","fname lname profile_image")
//   .populate("comments")

//   await Comment.findOne({ post_id: "62b8d804325f930584623019"})
//    .populate("author","fname lname email profile_image text_content")
//    .populate("post_id","content post_image comments loves ")
//   .exec((error,result) => {
//   console.log(result);

//   });
// }
// gb()
