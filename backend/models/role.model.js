const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const roleSchema = new Schema({
  name: String,
  roleDescription: String,
  goalDescription: String,
  extras: Schema.Types.Mixed
},{
  timestamps: true,
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;