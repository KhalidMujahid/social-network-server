const jwt = require("jsonwebtoken");
const User = require("../models/User");

// verify token
module.exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer", "").trim();
    if (!token) return res.status(401).send("Token is required");

    const decodeToken = jwt.verify(token, process.env.MY_SECRET);
    if (!decodeToken) return res.status(402).send("Token has expired");

    const user = await User.findOne({ _id: decodeToken._id });
    if (!user) {
      return res.status(403).send("Unauthorized");
    } else {
      await user.populate("friends");
      req.auth = user;
      next();
    }
  } catch (error) {
    return res.status(501).send("Token is required");
  }
};
