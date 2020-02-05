const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// This will contain way more fields once we flesh it out
const roomSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
    trim: true
  },
}, {
  timestamps: true,
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;