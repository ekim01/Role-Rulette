const router = require('express').Router();
const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;
let Player = require('../models/player.model');

// Handles incoming HTTP GET requests on the /players URL path
router.route('/').get((req, res) => {
  Player.find().populate('role')
    .then(players => res.json(players))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/getById').get((req, res) => {
  Player.findOne({ _id: req.query._id }).populate('role')
    .then(player => res.json(player))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;