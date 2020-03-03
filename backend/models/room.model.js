const Constants = require("../../common/constants");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const roomSchema = new Schema(
  {
    roomCode: {
      type: String,
      required: true,
      trim: true,
      minlength: [Constants.ROOMCODE_LENGTH, "code too short"],
      maxlength: [Constants.ROOMCODE_LENGTH, "code too long"]
    },
    players: [
      {
        type: Schema.Types.ObjectId,
        ref: "Player"
      }
    ],
    game: { type: Schema.Types.ObjectId, ref: "Game" }
  },
  {
    timestamps: true
  }
);

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
