// Configure the ENV
require("dotenv").config();

// Importing the DB
require("./src/config/database");

const express = require("express");
const app = express();
const helmet = require("helmet");
const path = require("path");
const cors = require("cors");
const socket = require("socket.io");
const postRouter = require("./src/routes/postRoutes");
const getRouter = require("./src/routes/getRoutes");
const updateRouter = require("./src/routes/updateRoutes");
const deleteRouter = require("./src/routes/deleteRoutes");

app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(
  cors({
    origin: process.env.NODE_ENV === "development" ? "*" : process.env.GLOBAL_HOST,
  })
);

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.use("/", postRouter);
app.use("/", getRouter);
app.use("/", updateRouter);
app.use("/", deleteRouter);

const server = app.listen(PORT, () =>
  console.log("Server running on port", PORT)
);

// socket connections
const io = socket(server, {
  cors: {
    origin: process.env.NODE_ENV === "development" ? "*" : process.env.GLOBAL_HOST,
    credentials: true,
  },
});

const activeUsers = new Map();

io.on("connection", (socket) => {
  // add user to the list
  socket.on("add-user", (userid) => {
    activeUsers.set(userid, socket.id);
  });

  // send message
  socket.on("send-message", (message) => {
    // get the user socket id
    const getUserID = activeUsers.get(message.to);

    // check if the user is active then send the message
    if (getUserID) {
      io.to(getUserID).emit("recive-message", message);
    }
  });

  socket.on("post", (posts) => {
    io.emit("new-post", posts);
  });
});
