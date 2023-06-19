const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  company: String,
  companyWebsite: String,
});

const User = mongoose.model("user", userSchema);

module.exports = User;
