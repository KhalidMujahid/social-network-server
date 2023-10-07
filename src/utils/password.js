const bcrypt = require("bcrypt");

// generate password hash
module.exports.generateHash = async (password) => {
  const pass = await bcrypt.hash(password, 13);
  return pass;
};

// Validate password
module.exports.verifyPassword = async (user_password, db_password) => {
  const verify = await bcrypt.compare(user_password, db_password);
  if (verify) return true;

  return false;
};
