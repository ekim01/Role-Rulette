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
      // Default game is set as Spyfall
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

  Room.findOne({ roomCode: req.body.roomname }).populate("players")
    .then(room => {
      if (room) {

        let allPlayers = room.players;
        let usernameInUse = false;
        for(let i = 0; i<allPlayers.length; i++)
        {
          let currPlayer = allPlayers[i];
          if((currPlayer.name).localeCompare(username) === 0) {
            usernameInUse = true;
            i = allPlayers.length;
          }
        }

        if(!usernameInUse) {

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
          return res.status(418).json('Name already in use.');
        }

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

// Saves new game to room objects using the game's title
router.route("/updateGame").put((req, res) => {
  let room = req.body.room
  Game.findOne({ title: req.body.gameTitle })
    .populate("roles")
    .then(game => {
      // Update game in room
      if (game) {
        Room.update(
          { _id: room._id },
          {
            $set: {
              game: game
            }
          }
        )
          .then(() => res.json(game))
          .catch(err => console.log(err));
      } else {
        return res.status(404).json('No game with selected title found');
      }
    })
    .catch(err => {
      console.log(err);
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
    .then(() => res.json('Game ended successfully.'))
    .catch(err => res.status(400).json("Error: " + err));
});


// Role distribution route that directs to different methods to handle different game distributions
router.route("/distributeRoles").put((req, res) => {
  let room = req.body.room
  if (room.game) {
    if (room.game.title == "Spyfall") {
      return spyfallDistribution(room, res)
    } else if (room.game.title == "Avalon") {
      return avalonDistribution(room, res)
    } else if (room.game.title == "Secret Dictator") {
      return secretDictatorDistribution(room, res)
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
      // sets gameInProgess boolean to true
      startGame(roomID)
      return res.json('Role Distribution Successful')
    }
    return res.status(404).json('Game location list not found');
  }
}

avalonDistribution = (room, res) => {
  let players = room.players
  let game = room.game
  let roomID = room._id
  // ensures player count is correct to play game
  if (players.length < Constants.AVALON_MINPLAYERS) {
    return res.status(418).json('Require more players to start game');
  } else if (players.length > Constants.AVALON_MAXPLAYERS) {
    return res.status(418).json('Maximum amount of players surpassed');
  } else {
    if (game.distributionRules) {
      // selects distribution rules based off of player number
      let rules = game.distributionRules.find(rules => rules.playerNum === players.length)
      if (rules) {
        // Role Array will contain one Merlin, one Assassin, one Loyal Servant of Arthur and one Minion of Mordor
        let roles = game.roles
        let servant = game.roles.find(role => role.name == "Loyal Servant of Arthur")
        let minion = game.roles.find(role => role.name == "Minion of Mordor")
        // add correct amount of extra servants and minions to role array, amount provided via distribution rules
        // keep in mind there are already 2 good and 2 bad roles in the array that are always present
        for (let i = 2; i < rules.good; i++) {
          roles.push(servant)
        }
        for (let i = 2; i < rules.bad; i++) {
          roles.push(minion)
        }
        // sets the role of each player in the room
        assignRoles(players, roles)
        // sets gameInProgess boolean to true
        startGame(roomID)
        return res.json('Role Distribution Successful')
      } else {
        return res.status(404).json('Distribution Rules for current number of players not found');
      }
    }
    return res.status(404).json('Distribution Rules list not found');
  }
}

secretDictatorDistribution = (room, res) => {
  let players = room.players
  let game = room.game
  let roomID = room._id
  // ensures player count is correct to play game
  if (players.length < Constants.DICTATOR_MINPLAYERS) {
    return res.status(418).json('Require more players to start game');
  } else if (players.length > Constants.DICTATOR_MAXPLAYERS) {
    return res.status(418).json('Maximum amount of players surpassed');
  } else {
    if (game.distributionRules) {
      // selects distribution rules based off of player number
      let rules = game.distributionRules.find(rules => rules.playerNum === players.length)
      if (rules) {
        // Role Array will contain one Dictator, one Fascist and one Liberal
        let roles = game.roles
        let liberal = game.roles.find(role => role.name == "Liberal")
        let fascist = game.roles.find(role => role.name == "Fascist")
        // add correct amount of extra liberals and fascists to role array, amount provided via distribution rules
        // keep in mind there are already 1 liberal and 2 fascist roles in the array that are always present
        for (let i = 1; i < rules.liberal; i++) {
          roles.push(liberal)
        }
        for (let i = 2; i < rules.fascist; i++) {
          roles.push(fascist)
        }
        // sets the role of each player in the room
        assignRoles(players, roles)
        // sets gameInProgess boolean to true
        startGame(roomID)
        return res.json('Role Distribution Successful')
      } else {
        return res.status(404).json('Distribution Rules for current number of players not found');
      }
    }
    return res.status(404).json('Distribution Rules list not found');
  }
}

// helper method used to set gameInProgress to true
startGame = (roomID) => {
  Room.where({ _id: roomID }).update(
    {
      $set: {
        gameInProgress: true
      }
    }
  )
    .then(() => console.log("Game started successfully"))
    .catch(err => console.log("Error: " + err));
}

// helper method to assign roles for Avalon and Secret Dictator (Spyfall assigns roles differently)
assignRoles = (players, roles) => {
  for (let i = 0; i < players.length; i++) {
    let role = ""
    let player = players[i]
    let roleToAdd = roles.splice(Math.floor(Math.random() * roles.length), 1) // remove one role randomly to assign to player
    role = roleToAdd[0] // splice returns an array, use the returned value to set role
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
}

module.exports = router;
