const Token = require("../models/tokenModel");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

async function getTokenByUuid(uuid) {
    const token = await Token.findOne({
        uuid: uuid,
    }).exec();

    return token;
}

async function _upsert(tokenDoc) {
    const uuid = uuidv4();

    const existingToken = await Token.findOne({
        token: tokenDoc.token,
    }).exec();

    if (existingToken !== null) {
        if (existingToken.name != null) {
            existingToken.name = tokenDoc.name;
        }
        existingToken.uuid = uuid;

        await Token.findOneAndUpdate({ token: tokenDoc.token }, existingToken)
            .then((result) => {
                console.log("Updated token: " + tokenDoc.token);
                return result;
            })
            .catch((error) => {
                console.log("Failed to update token: " + tokenDoc.token, error);
                throw error;
            });
    } else {
        tokenDoc.uuid = uuid;
        await tokenDoc
            .save()
            .then((result) => {
                console.log("Inserted token: " + tokenDoc.token);
                return result;
            })
            .catch((error) => {
                console.log("Failed to insert token: " + tokenDoc.token, error);
                throw error;
            });
    }

    return { uuid: uuid, expiresAt: tokenDoc.expiresAt };
}

module.exports = {
    _upsert,
    getTokenByUuid,
};
