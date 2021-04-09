const Movie = require("../models/pogModel");
const Channel = require("../models/channelModel");
const Token = require("../models/tokenModel");
const channelService = require("./channelService");
const tokenService = require("./tokenService");
const mongoose = require("mongoose");
const fetch = require("node-fetch");
const config = require("config");

async function twitchAuth(req, res) {
    // Verify token from request
    const token = req.body["access_token"];
    if (typeof token === "undefined" || !token) {
        res.status(400).json({
            status: "Error",
            message: "Token was not provided",
        });
        return;
    }

    // Get our channel/user info
    let twitchUser = null;
    try {
        twitchUser = await fetch("https://api.twitch.tv/helix/users", {
            method: "GET",
            headers: {
                Authorization: "Bearer " + encodeURI(token),
                "Client-Id": config.get("twitch.clientId"),
            },
        })
            .then((response) => response.text())
            .then((text) => {
                const twitchResponse = JSON.parse(text);
                if (
                    twitchResponse["data"] &&
                    twitchResponse["data"].length > 0
                ) {
                    return twitchResponse["data"][0];
                } else {
                    throw (
                        "Twitch API did not return a user for the provided token: " +
                        JSON.stringify(twitchResponse)
                    );
                }
            })
            .catch((error) => {
                console.log("Twitch failed during auth/verification: ", error);
                throw "Failed to authenticate with the Twitch API";
            });
    } catch (ex) {
        console.log("Exception: ", ex);
        res.status(401).json({
            status: "Error",
            message: "Failed to authenticate with the Twitch API",
        });
        return;
    }

    // Upsert channel
    const channelDoc = Channel();
    channelDoc.name = twitchUser["display_name"];
    channelDoc.login = twitchUser["login"];
    channelDoc.profileImageUrl = twitchUser["profile_image_url"];
    channelDoc.email = twitchUser["email"];
    channelDoc.broadcasterId = twitchUser["id"];

    let channel = null;
    try {
        channel = await channelService._upsert(channelDoc);
    } catch (ex) {
        throw "Failed to upsert channel while handing auth request";
    }

    // Upsert token
    const tokenDoc = Token();
    tokenDoc.token = token;
    tokenDoc.name = channel.name;
    let tokenResult = null;
    try {
        tokenResult = await tokenService._upsert(tokenDoc);
    } catch (ex) {
        console.log("Failed to upsert token", ex);
        throw "Failed to upsert token while handing auth request";
    }

    // Return token + channel info
    res.json({
        token: tokenResult.uuid,
        name: channel.name,
        profileImageUrl: channel.profileImageUrl,
        login: channel.login,
        expiresAt: tokenResult.expiresAt,
    });
}

module.exports = {
    twitchAuth,
};
