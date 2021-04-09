const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ChannelSchema = new Schema(
    {
        name: { type: String, required: true },
        login: { type: String, required: false },
        profileImageUrl: { type: String, required: false },
        email: { type: String, required: false },
        active: { type: Boolean },
        createdAt: { type: Date, default: Date.now },
        isAdmin: { type: Boolean, required: false, default: false },
        broadcasterId: { type: Number, required: false, default: null },
    },
    {
        toJSON: { virtuals: true },
    }
);

ChannelSchema.virtual("uri").get(function () {
    return `/channels/${this._id}`;
});

let Channel = mongoose.model("Channel", ChannelSchema);

module.exports = Channel;
