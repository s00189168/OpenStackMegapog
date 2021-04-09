const PubNub = require("pubnub");
const config = require("config");

async function publish(message) {
    const pubnub = new PubNub({
        subscribeKey: config.get("pubnub.subscribeKey"),
        publishKey: config.get("pubnub.publishKey"),
        uuid: config.get("pubnub.uuid"),
    });
    return await pubnub.publish({
        channel: config.get("pubnub.channel"),
        message: message,
    });
}

module.exports = {
    publish,
};
