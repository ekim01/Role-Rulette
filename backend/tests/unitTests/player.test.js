const mockingoose = require('mockingoose').default;
const request = require('supertest');
const express = require('express');
let Player = require('../../models/player.model');
const app = express();

// Sets express router to handle routes for test
beforeAll(() => {
  app.use(express.json());
  const playersRouter = require('../../routes/players');
  app.use('/players', playersRouter);
})

// Reset mocks before each test
beforeEach(() => {
  mockingoose.resetAll();
});

describe('Unit tests for players route', () => {
  test('GET method should return players array', () => {
    // used for mocking role populate
    Player.schema.path('role', Object);
    const players = [{
      _id: "507f191e810c19729de860ea",
      name: "Test User",
      host: true,
      role: {
        _id: "507f191e810c19729de860eb",
        name: "Test Role",
        roleDescription: "Role Description",
        goalDescription: "Goal Description",
        extras: null
      }
    }]
    mockingoose(Player).toReturn(players, 'find');
    return request(app).get('/players').expect(200).expect('Content-Type', /json/).then(response => {
      expect(response.body[0]).toMatchObject(players[0]);
    });
  });

  test('GET method should return an error', () => {
    const error = new Error("Test Error");
    mockingoose(Player).toReturn(error, 'find');
    return request(app).get('/players').expect(400).expect('Content-Type', /json/).then(response => {
      expect(response.body).toBe('Error: ' + error);
    });
  });

  test('GET by id method should return player', () => {
    // used for mocking role populate
    Player.schema.path('role', Object);
    const player = {
      _id: "507f191e810c19729de860ea",
      name: "Test User",
      host: true,
      role: {
        _id: "507f191e810c19729de860eb",
        name: "Test Role",
        roleDescription: "Role Description",
        goalDescription: "Goal Description",
        extras: null
      }
    }
    mockingoose(Player).toReturn(player, 'findOne');
    return request(app).get('/players/getById').query({ _id: "507f191e810c19729de860ea" }).expect(200).expect('Content-Type', /json/).then(response => {
      expect(response.body).toMatchObject(player);
    });
  });

  test('GET by id method should return an error', () => {
    const error = new Error("Test Error");
    mockingoose(Player).toReturn(error, 'findOne');
    return request(app).get('/players/getById').query({ _id: "507f191e810c19729de860ea" }).expect(400).expect('Content-Type', /json/).then(response => {
      expect(response.body).toBe('Error: ' + error);
    });
  });
})