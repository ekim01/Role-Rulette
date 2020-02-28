const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const roomSchema = new Schema({
  roomCode: String,
  players: [{
    type: Schema.Types.ObjectId, ref: 'Player'
  }],
  game: { type: Schema.Types.ObjectId, ref: 'Game' }
}, {
  timestamps: true,
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;