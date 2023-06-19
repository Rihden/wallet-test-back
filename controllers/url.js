const UrlModel = require("../models/url");

const redirectToUrl = async (req, res) => {
  const result = await UrlModel.findById(req.params.id);
  res.redirectToUrl(result.passUrl);
};

module.exports = {
  redirectToUrl,
};
