const router = require("express").Router();
const Constants = require("../../common/constants");
let Room = require("../models/room.model");
let Game = require("../models/game.model");
let Player = require("../models/player.model");
let Role = require("../models/role.model");

// Handles incoming HTTP GET requests on the /rooms/ URL path
router.route("/").get((req, res) => {
  Room.find()
    .populate({ path: "players", populate: { path: "role" } })
    .populate({ path: "game", populate: { path: "roles" } })
    .then(rooms => res.json(rooms))
    .catch(err => res.status(400).json("Error: " + err));
});

router.route("/getByRoomCode").get((req, res) => {
  Room.findOne({ roomCode: req.query.roomname })
    .populate({ path: "players", populate: { path: "role" } })
    .populate({ path: "game", populate: { path: "roles" } })
    .then(room => res.json(room))
    .catch(err => res.status(400).json("Error: " + err));
});

// Handles incoming HTTP POST requests on the /rooms/ URL path
router.route("/add").post((req, res) => {
  let newCode;
  let characters = Constants.ROOMCODE_CHARACTERS;
  let validCode = false;

  let user = req.body.username;
  // Sets null username to default string, to avoid db error
  if (!user) {
    user = "Player";
  }

  if (user.length > Constants.PLAYERNAME_MAXLENGTH) {
    console.log("Username %s exceeds max length", user);
    res.status(400);
    return res.send("Username exceeds max length.");
  }

  // Gets every room code currently in use
  Room.find()
    .select("roomCode")
    .then(codes => {
      // Ensures code is valid before using to create room
      while (!validCode) {
        validCode = true;
        newCode = "";
        // Creates a random string of length 4
        for (let i = 0; i < Constants.ROOMCODE_LENGTH; i++) {
          newCode += characters.charAt(
            Math.floor(Math.random() * characters.length)
          );
        }
        // Ensures new code is unique
        for (code in codes) {
          if (newCode == code) {
            validCode = false;
          }
        }
      }

      const newPlayer = new Player({
        name: user,
        host: true,
        role: null
      });

      newPlayer
        .save()
        .then(() => console.log("Player added"))
        .catch(err => console.log(err));
      // Default game for now (trimmed copy of spyfall)
      Game.findOne({ _id: "5e51d5031c9d440000648d19" })
        .populate("roles")
        .then(game => {
          const newRoom = new Room({
            roomCode: newCode,
            gameInProgress: false,
            players: [newPlayer],
            game: game
          });
          newRoom
            .save()
            .then(room => res.json(room))
            .catch(err => res.status(400).json("Error: " + err));

          console.log("Added room: " + newCode);
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
});

router.route("/addPlayer").post((req, res, next) => {
  let username = req.body.username;
  // Sets null username to default string, to avoid db error
  if (!username) {
    username = "Player";
  }

  if (username.length > Constants.PLAYERNAME_MAXLENGTH) {
    console.log("Username %s exceeds max length", username);
    res.status(400);
    return res.send("Username exceeds max length.");
  }

  Room.findOne({ roomCode: req.body.roomname })
    .then(room => {
      if (room) {
        // If room exists, add player to room

        const newPlayer = new Player({
          name: username,
          host: false,
          role: null
        });

        newPlayer
          .save()
          .then(() => console.log("Player added"))
          .catch(err => {
            console.log("Player failed to add");
            next(err);
          });
        // Add player to room
        Room.update(
          { _id: room._id },
          {
            $push: {
              players: newPlayer
            }
          }
        )
          .then(() => res.json(newPlayer))
          .catch(err => next(err));

        console.log(
          "Added player %s to room %s",
          req.body.username,
          req.body.roomname
        );
      } else {
        console.log("Room %s not found", req.body.roomname);
        return res.status(404).json('Room code not found.');
      }
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
});

// route that sets game state to end
router.route("/EndScreen").put((req, res) => {
  let roomID = req.body.room._id;
  Room.where({ _id: roomID }).update(
    {
      $set: {
        gameInProgress: false
      }
    }
  )
  .then(() => console.log("Game State set to \"false\" "))
  .catch(err => res.status(400).json("Error: " + err));
  return res.json('gameInProgress updated successfully')
});


// Role distribution route that directs to different methods to handle different game distributions
router.route("/distributeRoles").put((req, res) => {
  let room = req.body.room
  if (room.game) {
    // distribution rules only complete for spyfall so far
    if (room.game.title == "Spyfall") {
      return spyfallDistribution(room, res)
    } else {
      return res.status(404).json('Selected game does not have role distribution rules');
    }
  } else {
    return res.status(400).json('No game selected');
  }
});



spyfallDistribution = (room, res) => {
  let players = room.players
  let game = room.game
  let roomID = room._id
  // ensures player count is correct to play game
  if (players.length < Constants.SPYFALL_MINPLAYERS) {
    return res.status(418).json('Require more players to start game');
  } else if (players.length > Constants.SPYFALL_MAXPLAYERS) {
    return res.status(418).json('Maximum amount of players surpassed');
  } else {
    if (game.locations) {
      // selects random location from list of locations
      let location = game.locations[Math.floor(Math.random() * game.locations.length)]
      // selects all roles for the selected location
      let roles = game.roles.filter(role => role.location == location)
      // selects which player will be the spy
      let spyIndex = Math.floor(Math.random() * players.length)
      // set the role of each player in room
      for (let i = 0; i < players.length; i++) {
        let role = ""
        let player = players[i]
        if (i == spyIndex) {
          role = game.roles.find(role => role.name == "Spy") // set one player to spy
        } else {
          let roleToAdd = roles.splice(Math.floor(Math.random() * roles.length), 1) // remove one role randomly to assign to player
          role = roleToAdd[0] // splice returns an array, use the returned value to set role
        }
        Player.where({ _id: player._id }).update(
          {
            $set: {
              role: role
            }
          }
        )
          .then(() => console.log("Player " + i + " role set"))
          .catch(err => res.status(400).json("Error: " + err));
      }
      Room.where({ _id: roomID }).update(
        {
          $set: {
            gameInProgress: true
          }
        }
      )
      .then(() => console.log("gameInProgress set to \"true\" "))
      .catch(err => res.status(400).json("Error: " + err));
      return res.json('Role Distribution Successful')
    }
    return res.status(404).json('Game location list not found');
  }
}

module.exports = router;
