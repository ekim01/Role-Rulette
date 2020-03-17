const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const roleSchema = new Schema({
  name: String,
  location: {
    type: String,
    required: false
  },
  roleDescription: String,
  goalDescription: String
}, {
  timestamps: true,
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;