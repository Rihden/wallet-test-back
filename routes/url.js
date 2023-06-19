const express = require("express");

const router = express.Router();
const userController = require("../controllers/url");

router.post("/:id", userController.redirectToUrl);

module.exports = router;
