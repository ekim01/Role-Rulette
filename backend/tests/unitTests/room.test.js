const mockingoose = require('mockingoose').default;
const request = require('supertest');
const express = require('express');
let Room = require('../../models/room.model');
let Player = require('../../models/player.model');
let Game = require('../../models/game.model');
const app = express();

// Sets express router to handle routes for test
beforeAll(() => {
  app.use(express.json());
  const roomsRouter = require('../../routes/rooms');
  app.use('/rooms', roomsRouter);
})

// Reset mocks before each test
beforeEach(() => {
  mockingoose.resetAll();
});

describe('Unit tests for rooms route', () => {
  test('GET method should return rooms array', () => {
    // used for mocking players and game populate
    Room.schema.path('players', [Object]);
    Room.schema.path('game', Object);
    const rooms = [{
      _id: "507f191e810c19729de860ec",
      roomCode: "AAAA",
      players: [{
        _id: "507f191e810c19729de860ea",
        name: "Test User",
        host: true,
        role: {
          _id: "507f191e810c19729de860eb",
          name: "Test Role",
          roleDescription: "Role Description",
          goalDescription: "Goal Description"
        }
      }],
      game: {
        title: "Test Game",
        description: "Game Description",
        distributionRules: false,
        roles: [{
          _id: "507f191e810c19729de860eb",
          name: "Test Role",
          roleDescription: "Role Description",
          goalDescription: "Goal Description"
        }]
      }
    }]
    mockingoose(Room).toReturn(rooms, 'find');
    return request(app).get('/rooms').expect(200).expect('Content-Type', /json/).then(response => {
      expect(response.body[0]).toMatchObject(rooms[0]);
    });
  });

  test('GET method should return an error', () => {
    const error = new Error("Test Error");
    mockingoose(Room).toReturn(error, 'find');
    return request(app).get('/rooms').expect(400).expect('Content-Type', /json/).then(response => {
      expect(response.body).toBe('Error: ' + error);
    });
  });

  test('GET by room code method should return rooms array', () => {
    // used for mocking players and game populate
    Room.schema.path('players', [Object]);
    Room.schema.path('game', Object);
    const room = {
      _id: "507f191e810c19729de860ec",
      roomCode: "AAAA",
      players: [{
        _id: "507f191e810c19729de860ea",
        name: "Test User",
        host: true,
        role: {
          _id: "507f191e810c19729de860eb",
          name: "Test Role",
          roleDescription: "Role Description",
          goalDescription: "Goal Description"
        }
      }],
      game: {
        title: "Test Game",
        description: "Game Description",
        distributionRules: false,
        roles: [{
          _id: "507f191e810c19729de860eb",
          name: "Test Role",
          roleDescription: "Role Description",
          goalDescription: "Goal Description"
        }]
      }
    }
    mockingoose(Room).toReturn(room, 'findOne');
    return request(app).get('/rooms/getByRoomCode').query({ roomCode: "AAAA" }).expect(200).expect('Content-Type', /json/).then(response => {
      expect(response.body).toMatchObject(room);
    });
  });

  test('GET by room code method should return an error', () => {
    const error = new Error("Test Error");
    mockingoose(Room).toReturn(error, 'findOne');
    return request(app).get('/rooms/getByRoomCode').query({ roomCode: "AAAA" }).expect(400).expect('Content-Type', /json/).then(response => {
      expect(response.body).toBe('Error: ' + error);
    });
  });

  test('POST creating room should return created room', () => {
    // used for mocking players, game and roles populates
    Room.schema.path('players', [Object]);
    Room.schema.path('game', Object);
    Game.schema.path('roles', [Object]);
    const rooms = [{
      _id: "507f191e810c19729de860ec",
      roomCode: "AAAA",
      players: [],
      game: null
    }]
    const game = {
      title: "Test Game",
      description: "Game Description",
      distributionRules: false,
      roles: [{
        _id: "507f191e810c19729de860eb",
        name: "Test Role",
        roleDescription: "Role Description",
        goalDescription: "Goal Description"
      }]
    }
    const newRoom = {
      _id: "507f191e810c19729de860ed",
      roomCode: "BBBB",
      players: [{
        _id: "507f191e810c19729de860ea",
        name: "Test User",
        host: true,
        role: {
          _id: "507f191e810c19729de860eb",
          name: "Test Role",
          roleDescription: "Role Description",
          goalDescription: "Goal Description"
        }
      }],
      game: game
    }
    mockingoose(Room).toReturn(rooms, 'find');
    mockingoose(Player).toReturn({}, 'save');
    mockingoose(Game).toReturn(game, 'findOne');
    mockingoose(Room).toReturn(newRoom, 'save');
    return request(app).post('/rooms/add').send({ username: "Test User" }).expect(200).expect('Content-Type', /json/).then(response => {
      expect(response.body).toMatchObject(newRoom);
    });
  });

  test('POST creating room should return error', () => {
    const error = new Error("Test Error");
    mockingoose(Room).toReturn({}, 'find');
    mockingoose(Player).toReturn({}, 'save');
    mockingoose(Game).toReturn({}, 'findOne');
    mockingoose(Room).toReturn(error, 'save');
    return request(app).post('/rooms/add').send({ username: "Test User" }).expect(400).expect('Content-Type', /json/).then(response => {
      expect(response.body).toBe('Error: ' + error);
    });
  });

  test('POST adding player to room should return added player', () => {
    // used for mocking players and game populate
    Room.schema.path('players', [Object]);
    Room.schema.path('game', Object);
    const room = {
      _id: "507f191e810c19729de860ec",
      roomCode: "AAAA",
      players: [{
        _id: "507f191e810c19729de860ea",
        name: "Test User",
        host: true,
        role: {
          _id: "507f191e810c19729de860eb",
          name: "Test Role",
          roleDescription: "Role Description",
          goalDescription: "Goal Description"
        }
      }],
      game: {
        title: "Test Game",
        description: "Game Description",
        distributionRules: false,
        roles: [{
          _id: "507f191e810c19729de860eb",
          name: "Test Role",
          roleDescription: "Role Description",
          goalDescription: "Goal Description"
        }]
      }
    }
    mockingoose(Room).toReturn(room, 'findOne');
    mockingoose(Player).toReturn({}, 'save');
    mockingoose(Room).toReturn({}, 'update');
    return request(app).post('/rooms/addPlayer').send({ username: "Test User 2", roomname: "AAAA" }).expect(200).expect('Content-Type', /json/).then(response => {
      // object is not returned from update call, the object sent in the response is generated in the method itself
      let player = response.body;
      expect(player.name).toEqual("Test User 2");
      expect(player.hasOwnProperty('name')).toBeTruthy();
      expect(player.hasOwnProperty('host')).toBeTruthy();
      expect(player.hasOwnProperty('role')).toBeTruthy();
    });
  });

  test('POST adding player to room should return error', () => {
    // used for mocking players and game populate
    Room.schema.path('players', [Object]);
    Room.schema.path('game', Object);
    const room = {
      _id: "507f191e810c19729de860ec",
      roomCode: "AAAA",
      players: [],
      game: null
    }
    const error = new Error("Test Error");
    mockingoose(Room).toReturn(room, 'findOne');
    mockingoose(Player).toReturn({}, 'save');
    mockingoose(Room).toReturn(error, 'update');
    // expect different error code then normal as the error is handled by express via next(err) which sends an Internal Server Error 500
    return request(app).post('/rooms/addPlayer').send({ username: "Test User 2", roomname: "AAAA" }).expect(500);
  });

  test('POST adding player to room with incorrect room code should return error', () => {
    mockingoose(Room).toReturn(null, 'findOne');
    return request(app).post('/rooms/addPlayer').send({ username: "Test User 2", roomname: "Invalid room code" }).expect(404).expect('Content-Type', /json/).then(response => {
      expect(response.body).toBe('Room code not found.');
    });
  });

  // Testing Role Distribution cases
  test('PUT role distribution with no game provided should return error', () => {
    const room = {
      _id: "507f191e810c19729de860ec",
      roomCode: "AAAA",
      players: [],
      game: null
    }
    return request(app).put('/rooms/distributeRoles').send({ room: room }).expect(400).expect('Content-Type', /json/).then(response => {
      expect(response.body).toBe('No game selected');
    });
  });

  test('PUT role distribution for game without distribution rules implemented should return error', () => {
    // used for mocking game populate
    Room.schema.path('game', Object);
    const room = {
      _id: "507f191e810c19729de860ec",
      roomCode: "AAAA",
      players: [],
      game: {
        title: "Test Game",
        description: "Game Description",
        distributionRules: false,
        roles: [{
          _id: "507f191e810c19729de860eb",
          name: "Test Role",
          roleDescription: "Role Description",
          goalDescription: "Goal Description"
        }]
      }
    }
    return request(app).put('/rooms/distributeRoles').send({ room: room }).expect(404).expect('Content-Type', /json/).then(response => {
      expect(response.body).toBe('Selected game does not have role distribution rules');
    });
  });

  test('PUT Spyfall role distribution without minimum amount of players should return error', () => {
    // used for mocking game populate
    Room.schema.path('game', Object);
    const room = {
      _id: "507f191e810c19729de860ec",
      roomCode: "AAAA",
      players: [],
      game: {
        title: "Spyfall",
        description: "Game Description",
        distributionRules: false,
        roles: [{
          _id: "507f191e810c19729de860eb",
          name: "Test Role",
          roleDescription: "Role Description",
          goalDescription: "Goal Description"
        }]
      }
    }
    return request(app).put('/rooms/distributeRoles').send({ room: room }).expect(418).expect('Content-Type', /json/).then(response => {
      expect(response.body).toBe('Require more players to start game');
    });
  });

  test('PUT Spyfall role distribution with over maximum amount of players should return error', () => {
    // used for mocking players and game populate
    Room.schema.path('players', [Object]);
    Room.schema.path('game', Object);
    const room = {
      _id: "507f191e810c19729de860ec",
      roomCode: "AAAA",
      players: [{
        _id: "507f191e810c19729de860ea",
        name: "Test User1",
        host: true,
        role: null
      },
      {
        _id: "507f191e810c19729de860eb",
        name: "Test User2",
        host: true,
        role: null
      },
      {
        _id: "507f191e810c19729de860ec",
        name: "Test User3",
        host: true,
        role: null
      },
      {
        _id: "507f191e810c19729de860ed",
        name: "Test User4",
        host: true,
        role: null
      },
      {
        _id: "507f191e810c19729de860ee",
        name: "Test User5",
        host: true,
        role: null
      },
      {
        _id: "507f191e810c19729de860ef",
        name: "Test User6",
        host: true,
        role: null
      },
      {
        _id: "507f191e810c19729de860e1",
        name: "Test User7",
        host: true,
        role: null
      },
      {
        _id: "507f191e810c19729de860e2",
        name: "Test User8",
        host: true,
        role: null
      },
      {
        _id: "507f191e810c19729de860e3",
        name: "Test User9",
        host: true,
        role: null
      }],
      game: {
        title: "Spyfall",
        description: "Game Description",
        distributionRules: false,
        roles: [{
          _id: "507f191e810c19729de860eb",
          name: "Test Role",
          roleDescription: "Role Description",
          goalDescription: "Goal Description"
        }]
      }
    }
    return request(app).put('/rooms/distributeRoles').send({ room: room }).expect(418).expect('Content-Type', /json/).then(response => {
      expect(response.body).toBe('Maximum amount of players surpassed');
    });
  });

  test('PUT Spyfall role distribution without locations should return error', () => {
    // used for mocking players and game populate
    Room.schema.path('players', [Object]);
    Room.schema.path('game', Object);
    const room = {
      _id: "507f191e810c19729de860ec",
      roomCode: "AAAA",
      players: [{
        _id: "507f191e810c19729de860ea",
        name: "Test User1",
        host: true,
        role: null
      },
      {
        _id: "507f191e810c19729de860eb",
        name: "Test User2",
        host: true,
        role: null
      },
      {
        _id: "507f191e810c19729de860ec",
        name: "Test User3",
        host: true,
        role: null
      }],
      game: {
        title: "Spyfall",
        description: "Game Description",
        distributionRules: false,
        roles: [],
        locations: null
      }
    }
    return request(app).put('/rooms/distributeRoles').send({ room: room }).expect(404).expect('Content-Type', /json/).then(response => {
      expect(response.body).toBe('Game location list not found');
    });
  });

  test('PUT Spyfall role distribution works as intended with correct number of players', () => {
    // used for mocking players and game populate
    Room.schema.path('players', [Object]);
    Room.schema.path('game', Object);
    const room = {
      _id: "507f191e810c19729de860ec",
      roomCode: "AAAA",
      players: [{
        _id: "507f191e810c19729de860ea",
        name: "Test User1",
        host: true,
        role: null
      },
      {
        _id: "507f191e810c19729de860eb",
        name: "Test User2",
        host: true,
        role: null
      },
      {
        _id: "507f191e810c19729de860ec",
        name: "Test User3",
        host: true,
        role: null
      }],
      game: {
        title: "Spyfall",
        description: "Game Description",
        distributionRules: false,
        roles: [{
          _id: "507f191e810c19729de860eb",
          name: "Pilot",
          roleDescription: "Role Description",
          goalDescription: "Goal Description",
          location: "Airplane"
        },
        {
          _id: "507f191e810c19729de860ec",
          name: "Passenger",
          roleDescription: "Role Description",
          goalDescription: "Goal Description",
          location: "Airplane"
        }],
        locations: ["Airplane"]
      }
    }
    mockingoose(Player).toReturn({}, 'update');
    return request(app).put('/rooms/distributeRoles').send({ room: room }).expect(200).expect('Content-Type', /json/).then(response => {
      expect(response.body).toBe('Role Distribution Successful');
    });
  });
});