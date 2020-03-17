const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const gameSchema = new Schema({
  title: String,
  description: String,
  distributionRules: [{
    playerNum: Number,
    any: Schema.Types.Mixed
  }],
  roles: [{
    type: Schema.Types.ObjectId, ref: 'Role'
  }],
  locations: {
    type: [String],
    required: false
  }
}, {
  timestamps: true,
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;