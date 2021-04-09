const express = require("express");
const cors = require("cors");
const service = require("../services/authService");

const router = express.Router();

router.post("/", (req, res) => {
    service.twitchAuth(req, res);
});

module.exports = router;
