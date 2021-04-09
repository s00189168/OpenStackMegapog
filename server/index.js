const express = require("express");
const bodyParser = require("body-parser");
var path = require("path");
const config = require("config");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
    .connect(config.get("db"), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Successfully connected to the MongoDB database");
    })
    .catch((err) => {
        console.log("Unable to connect to the MongoDB database", err);
        process.exit();
    });

const indexRoutes = require("./app/routes/index.routes.js");
const pogRoutes = require("./app/routes/pogs.routes.js");
const channelRoutes = require("./app/routes/channels.routes.js");
const authRoutes = require("./app/routes/auth.routes.js");

// Add headers
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", config.get("webapp.host"));
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type,Authorization"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});

app.use("/", indexRoutes);
app.use("/pogs", pogRoutes);
app.use("/channels", channelRoutes);
app.use("/auth", authRoutes);

// Public + Auth / callback
app.use(express.static(path.join(__dirname, "app/public")));
app.get("/callback", function (req, res) {
    res.sendFile(path.join(__dirname + "/app/public/callback.html"));
});

app.listen(config.get("app.port"), () => {
    console.log(
        "Server listening on port " + config.get("app.port").toString()
    );
});
