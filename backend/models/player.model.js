const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const playerSchema = new Schema({
    name:{
        type: String,
        required: true,
        trim: true,
        minlength: [1,'name too short'],
        maxlength: [15, 'name too long']
    },
    host: Boolean,
    role: { type: Schema.Types.ObjectId, ref: 'Role' }
},{
  timestamps: true,
});


const Player = mongoose.model('Player', playerSchema);

module.exports = Player