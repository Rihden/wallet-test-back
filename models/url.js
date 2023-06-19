const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  passUrl: String,
});

const UrlModel = mongoose.model("url", urlSchema);

module.exports = UrlModel;
