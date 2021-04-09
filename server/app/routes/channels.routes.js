const express = require("express");
const service = require("../services/channelService");
const tokenService = require("../services/tokenService");
const tokenHelper = require("../helpers/tokenHelper");
const auth = require("../middlewares/auth.js");
const cors = require("cors");
const router = express.Router();

router.post("/", auth("admin"), cors(), (req, res) => {
    service.upsertChannel(req, res);
});

router.get("/", auth("admin"), cors(), (req, res) => {
    service.getChannels(req, res);
});

router.put("/", auth("channelOwner"), cors(), (req, res) => {
    service.upsertChannel(req, res);
});

router.get("/active", cors(), (req, res) => {
    service.getActiveChannels(req, res);
});

router.post("/mine/join", auth(), cors(), (req, res) => {
    service.joinMyChannel(req, res);
});

router.post("/mine/part", auth(), cors(), (req, res) => {
    service.partMyChannel(req, res);
});

router.post("/mine", auth("channelOwner"), cors(), async (req, res) => {
    service.upsertChannel(req, res);
});

router.get("/mine", cors("channelOwner"), (req, res) => {
    service.getMyChannel(req, res);
});

router.get("/:name", cors("channelOwner"), (req, res) => {
    service.getChannel(req, res);
});

router.delete("/:name", auth("admin"), cors(), (req, res) => {
    service.deleteChannel(req, res);
});

module.exports = router;
