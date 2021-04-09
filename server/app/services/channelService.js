const Movie = require("../models/pogModel");
const Channel = require("../models/channelModel");
const tokenHelper = require("../helpers/tokenHelper");
const tokenService = require("../services/tokenService");
const pubnubHelper = require("../helpers/pubnubHelper");
const mongoose = require("mongoose");

mongoose.set("useFindAndModify", false);

async function upsertChannel(req, res) {
    let channelDoc = new Channel(req.body);

    try {
        const channel = await _upsert(channelDoc);
        res.location(channel.uri)
            .status(201)
            .json({ id: channel._id, uri: channel.uri });
    } catch (ex) {
        console.log("Error upserting channel: ", ex);
        res.status(400).json({
            status: "Error",
            message: "Failed to upsert channel",
        });
    }
}

async function joinMyChannel(req, res) {
    let uuidToken = req.header("Authorization");
    let [status, channel] = await _joinPartChannel(uuidToken, true);
    if (!status) {
        res.status(500).json({
            status: "Error",
            message: "Failed to join channel (while updating channel object)",
        });
        return;
    }

    if (channel) {
        pubnubHelper.publish({ cmd: "join", value: channel });
    }

    res.status(200).json({
        status: "Success",
        message: "Joined channel",
    });
}

async function partMyChannel(req, res) {
    let uuidToken = req.header("Authorization");
    let [status, channel] = await _joinPartChannel(uuidToken, false);
    if (!status) {
        res.status(500).json({
            status: "Error",
            message: "Failed to join channel (while updating channel object)",
        });
        return;
    }

    if (channel) {
        pubnubHelper.publish({ cmd: "part", value: channel });
    }

    res.status(200).json({
        status: "Success",
        message: "Left channel",
    });
}

async function _fetchChannelNameFromToken(uuidToken) {
    const cleanToken = tokenHelper.cleanToken(uuidToken);
    if (!cleanToken) {
        return null;
    }
    const token = await tokenService.getTokenByUuid(cleanToken);
    if (!token) {
        return null;
    }
    return token.name;
}

async function _joinPartChannel(uuidToken, state) {
    const channelName = await _fetchChannelNameFromToken(uuidToken);
    if (!channelName) {
        return [false, null];
    }
    const channel = await _getByName(channelName);
    if (!channel) {
        return [false, null];
    }
    let partialChannelDoc = new Channel();
    partialChannelDoc.name = channel.name;
    partialChannelDoc.active = state;
    await _upsert(partialChannelDoc);
    return [true, channel["login"]];
}

async function _upsert(channelDoc) {
    let channelResult = null;
    channelDoc.isAdmin = false;

    const existingChannel = await _getByName(channelDoc.name);
    if (existingChannel !== null) {
        if (channelDoc.login != null) {
            existingChannel.login = channelDoc.login;
        }
        if (channelDoc.profileImageUrl != null) {
            existingChannel.profileImageUrl = channelDoc.profileImageUrl;
        }
        if (channelDoc.email != null) {
            existingChannel.email = channelDoc.email;
        }
        if (channelDoc.active != null) {
            existingChannel.active = channelDoc.active;
        }
        if (channelDoc.broadcasterId != null) {
            existingChannel.broadcasterId = channelDoc.broadcasterId;
        }

        channelResult = await Channel.findOneAndUpdate(
            { name: channelDoc.name },
            existingChannel
        )
            .then((result) => {
                console.log("Updated channel: " + channelDoc.name);
                return result;
            })
            .catch((error) => {
                console.log(
                    "Failed to update channel: " + channelDoc.name,
                    error
                );
                throw error;
            });
    } else {
        channelResult = await channelDoc
            .save()
            .then((result) => {
                console.log("Inserted channel: " + channelDoc.name);
                return result;
            })
            .catch((error) => {
                console.log(
                    "Failed to insert channel: " + channelDoc.name,
                    error
                );
                throw error;
            });
    }

    return channelResult;
}

function getActiveChannels(req, res, options = []) {
    Channel.find({ active: true })
        .then((result) => {
            const results = result.map((item) => item.name);
            res.json({ count: result.length, items: results });
        })
        .catch((error) => res.status(500).json({ error: "Error: " + error }));
}

async function getChannel(req, res) {
    const name = req.params.name;
    const channel = await _getByName(name);

    if (channel !== null) {
        // Todo: Safe transformer? (email, etc.)
        res.json(channel);
    } else {
        res.status(404).json({
            status: "Error",
            message: "Channel does not exist",
        });
    }
}

async function getMyChannel(req, res) {
    const uuidToken = req.header("Authorization");
    req.params.name = await this._fetchChannelNameFromToken(uuidToken);
    return await this.getChannel(req, res);
}

async function _getByName(name) {
    return await Channel.findOne({
        name: name,
    }).exec();
}

function getChannels(req, res) {
    Channel.find()
        .then((result) => {
            res.json({ count: result.length, items: result });
        })
        .catch((error) => res.status(500).json({ error: "Error: " + error }));
}

async function deleteChannel(req, res) {
    const name = req.params.name;

    Channel.findOneAndDelete({ name: name })
        .then((result) => {
            if (result) {
                res.status(203).send({ message: "Channel deleted" });
            } else {
                res.status(404).send({ message: "Channel not found" });
            }
        })
        .catch((error) =>
            res.status(404).send({ message: "Channel not found: " + error })
        );

    return;
}

function search(req, res, options = []) {
    const name = req.query;
    let filter = {};

    if (name) {
        filter.name = { $regex: `^${name}$`, $options: "i" };
    }

    Channel.find(filter)
        .sort({ createdAt: -1 })
        .limit(20)
        .map((result) => {
            return result.json({
                name: result.name,
                login: result.login,
                profileImageUrl: result.profileImageUrl,
            });
        })
        .then((results) => {
            res.json(results);
        })
        .catch((error) => res.status(500).json({ error: "Error: " + error }));
}

module.exports = {
    upsertChannel,
    getActiveChannels,
    getChannels,
    getChannel,
    getMyChannel,
    deleteChannel,
    search,
    joinMyChannel,
    partMyChannel,
    _upsert,
    _getByName,
    _fetchChannelNameFromToken,
};
