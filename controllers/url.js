const UrlModel = require("../models/url");

const redirectToUrl = async (req, res) => {
  const result = await UrlModel.findById(req.params.id);
  res.redirect(result.passUrl);
};

module.exports = {
  redirectToUrl,
};
