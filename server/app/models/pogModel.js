const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PogSchema = new Schema(
  {
    channel: { type: String, required: true },
    type: { type: String },
    user: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  {
    toJSON: { virtuals: true },
  }
);

PogSchema.methods.toResource = function () {
  return {
    id: this.id,
    channel: this.channel,
    createdAt: this.createdAt,
    type: this.type,
  };
};

PogSchema.virtual("uri").get(function () {
  return `/pogs/${this._id}`;
});

let Pog = mongoose.model("Pog", PogSchema);

module.exports = Pog;
