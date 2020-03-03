const router = require('express').Router();
let Room = require('../models/room.model');
let Game = require('../models/game.model');
let Player = require('../models/player.model');
let Role = require('../models/role.model');

// Handles incoming HTTP GET requests on the /rooms/ URL path
router.route('/').get((req, res) => {
  Room.find().populate({ path: 'players', populate: { path: 'role' } }).populate({ path: 'game', populate: { path: 'roles' } })
    .then(rooms => res.json(rooms))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/getByRoomCode').get((req, res) => {
  Room.findOne({ roomCode: req.query.roomname }).populate({ path: 'players', populate: { path: 'role' } }).populate({ path: 'game', populate: { path: 'roles' } })
    .then(room => res.json(room))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Handles incoming HTTP POST requests on the /rooms/ URL path
router.route('/add').post((req, res) => {
  let newCode;
  let characters = 'ABCDEFGHIJKLMNPQRSTUVWXYZ0123456789';
  let validCode = false;

  let username = req.body.username
  // Sets null username to default string, to avoid db error
  if (!username) {
    username = 'Player'
  }

  // Gets every room code currently in use
  Room.find().select('roomCode').then((codes) => {
    // Ensures code is valid before using to create room
    while (!validCode) {
      validCode = true;
      newCode = '';
      // Creates a random string of length 4
      for (let i = 0; i < 4; i++) {
        newCode += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      // Ensures new code is unique
      for (code in codes) {
        if (newCode == code) {
          validCode = false;
        }
      }
    }

    const newPlayer = new Player({
      name: req.body.username,
      host: true,
      role: null
    });

    newPlayer.save()
      .then(() => console.log("Player added"))
      .catch(err => console.log(err));
    // Default game for now (trimmed copy of spyfall)
    Game.findOne({ _id: "5e51d5031c9d440000648d19" }).populate('roles').then((game) => {

      const newRoom = new Room({
        roomCode: newCode,
        players: [
          newPlayer
        ],
        game: game
      });
      newRoom.save()
        .then((room) => res.json(room))
        .catch(err => res.status(400).json('Error: ' + err));

      console.log("Added room: " + newCode);
    }).catch((err) => {
      console.log(err);
    });
  }).catch((err) => {
    console.log(err);
  });

});

router.route('/addPlayer').post((req, res, next) => {
  let username = req.body.username
  // Sets null username to default string, to avoid db error
  if (!username) {
    username = 'Player'
  }

  Room.findOne({ roomCode: req.body.roomname }).then((room) => {
    if (room) { // If room exists, add player to room

      const newPlayer = new Player({
        name: username,
        host: false,
        role: null
      });

      newPlayer.save()
        .then(() => console.log("Player added"))
        .catch(err => {
          console.log("Player failed to add");
          next(err);
        });
      // Add player to room
      Room.update({ _id: room._id },
        {
          $push: {
            players: newPlayer
          }
        }).then(() => res.json(newPlayer))
        .catch(err => next(err));

      console.log("Added player %s to room %s", req.body.username, req.body.roomname);
    } else {
      console.log("Room %s not found", req.body.roomname);
      return res.status(404).json('Room code not found.');
    }
  }).catch((err) => {
    console.log(err);
    next(err);
  });
});

module.exports = router;
