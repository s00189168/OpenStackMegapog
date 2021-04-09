const express = require("express");
const service = require("../services/pogService");
const cors = require("cors");

const router = express.Router();

router.post("/", cors(), (req, res) => {
    service.createPog(req, res);
});

router.get("/", cors(), (req, res) => {
    service.getAggregatePogs(req, res);
});

router.get("/:channel", cors(), (req, res) => {
    service.getAggregatePogs(req, res);
});

router.get("/:channel/list", cors(), (req, res) => {
    service.getPogs(req, res);
});

module.exports = router;
