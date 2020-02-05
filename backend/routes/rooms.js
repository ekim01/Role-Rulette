const router = require('express').Router();
let Room = require('../models/room.model');

// Handles incoming HTTP GET requests on the /rooms/ URL path
router.route('/').get((req, res) => {
  Room.find()
    .then(rooms => res.json(rooms))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Handles incoming HTTP POST requests on the /rooms/add/ URL path
router.route('/add').post((req, res) => {
  const id = req.body.id;

  const newRoom = new Room({id});

  newRoom.save()
    .then(() => res.json('Room added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;