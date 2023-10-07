const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

mongoose
  .connect(
    process.env.NODE_ENV === "development"
      ? process.env.MONGO_DB
      : process.env.MONGO_DB_GLOBAL
  )
  .then(() => console.log("DB connected!"))
  .catch((error) => console.log(error));
