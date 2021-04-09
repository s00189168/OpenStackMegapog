const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TokenSchema = new Schema(
    {
        uuid: { type: String, required: false },
        token: { type: String, required: true },
        name: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        expiresAt: {
            type: Date,
            default: new Date(+new Date() + 7 * 24 * 60 * 60 * 1000),
        },
    },
    {
        toJSON: { virtuals: true },
    }
);

TokenSchema.virtual("uri").get(function () {
    return `/token/${this._id}`;
});

let Token = mongoose.model("Token", TokenSchema);

module.exports = Token;
