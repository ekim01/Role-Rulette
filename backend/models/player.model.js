const Constants = require("../../common/constants");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const playerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [1, "name too short"],
      maxlength: [Constants.PLAYERNAME_MAXLENGTH, "name too long"]
    },
    host: Boolean,
    role: { type: Schema.Types.ObjectId, ref: "Role" }
  },
  {
    timestamps: true
  }
);

const Player = mongoose.model("Player", playerSchema);

module.exports = Player;
