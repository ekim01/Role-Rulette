const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const gameSchema = new Schema({
  title: String,
  description: String,
  distributionRules: Boolean,
  roles: [{
    type: Schema.Types.ObjectId, ref: 'Role'
  }]
},{
  timestamps: true,
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;