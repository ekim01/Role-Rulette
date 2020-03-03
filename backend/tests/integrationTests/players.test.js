const request = require('supertest');
const express = require('express');
const testDB = require('./test-db');
const app = express();

// Connect to a new in-memory database before running any tests.
beforeAll(async () => await testDB.connect());

// Sets express router to handle routes for test
beforeAll(() => {
  app.use(express.json());
  const playersRouter = require('../../routes/players');
  const roomsRouter = require('../../routes/rooms');
  app.use('/players', playersRouter);
  app.use('/rooms', roomsRouter);
})

// Clear test data after each test
afterEach(async () => await testDB.clearDatabase());

// Remove and close db and server
afterAll(async () => await testDB.closeDatabase());

describe('Integration tests for players route', () => {
  test('GET method should return json containing all players with correct object structure', () => {
    // Room is added with Test User host that is also added to player document (currently we don't have player creation except via rooms)
    return request(app).post('/rooms/add').send({ username: "Test User" }).expect(200).expect('Content-Type', /json/).then(response => {
      return request(app).get('/players').expect(200).expect('Content-Type', /json/).then(response => {
        for(player of response.body) {
          expect(player.hasOwnProperty('name')).toBeTruthy();
          expect(player.hasOwnProperty('host')).toBeTruthy();
          expect(player.hasOwnProperty('role')).toBeTruthy();
        }
      });
    });
  });
});