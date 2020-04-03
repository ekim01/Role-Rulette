const request = require('supertest');
const express = require('express');
const testDB = require('./test-db');
const app = express();

// Connect to a new in-memory database before running any tests.
beforeAll(async () => await testDB.connect());

// Sets express router to handle routes for test
beforeAll(() => {
  app.use(express.json());
  const roomsRouter = require('../../routes/rooms');
  app.use('/rooms', roomsRouter);
})

// Clear test data after each test
afterEach(async () => await testDB.clearDatabase());

// Remove and close db
afterAll(async () => await testDB.closeDatabase());

describe('Integration tests for rooms route', () => {
  test('POST method should create room with correct object structure', () => {
    return request(app).post('/rooms/add').send({ username: "Test User" }).expect(200).expect('Content-Type', /json/).then(response => {
      let room = response.body
      expect(room.hasOwnProperty('roomCode')).toBeTruthy();
      expect(room.hasOwnProperty('players')).toBeTruthy();
      expect(room.hasOwnProperty('game')).toBeTruthy();
      // host will be only player in room
      expect(room.players[0].name).toEqual('Test User')
    });
  });

  test('GET method should return json containing all rooms with correct object structure', () => {
    return request(app).post('/rooms/add').send({ username: "Test User" }).expect(200).expect('Content-Type', /json/).then(response => {
      return request(app).post('/rooms/add').send({ username: "Test User 2" }).expect(200).expect('Content-Type', /json/).then(response => {
        return request(app).get('/rooms').expect(200).expect('Content-Type', /json/).then(response => {
          for (room of response.body) {
            expect(room.hasOwnProperty('roomCode')).toBeTruthy();
            expect(room.hasOwnProperty('players')).toBeTruthy();
            expect(room.hasOwnProperty('game')).toBeTruthy();
          }
        });
      });
    });
  });

  test('POST method should create player and add to room with correct object structure', () => {
    return request(app).post('/rooms/add').send({ username: "Test User" }).expect(200).expect('Content-Type', /json/).then(response => {
      return request(app).post('/rooms/addPlayer').send({ username: "Test User 2", roomname: response.body.roomCode }).expect(200).expect('Content-Type', /json/).then(res => {
        let player = res.body
        expect(player.name).toEqual("Test User 2");
        expect(player.hasOwnProperty('name')).toBeTruthy();
        expect(player.hasOwnProperty('host')).toBeTruthy();
        expect(player.hasOwnProperty('role')).toBeTruthy();
      });
    });
  })

  test('POST method should return error when attempting to add a player using a room code that does not exist', () => {
    return request(app).post('/rooms/addPlayer').send({ username: "Test User", roomname: "invalid code" }).expect(404);
  })

  test('GET method should return a room using its room code', () => {
    return request(app).post('/rooms/add').send({ username: "Test User" }).expect(200).expect('Content-Type', /json/).then(response => {
      return request(app).get('/rooms/getByRoomCode').query({ roomname: response.body.roomCode }).expect('Content-Type', /json/).then(res => {
        expect(res.body.roomCode).toEqual(response.body.roomCode);
      });
    });
  })

  test('PUT method should remove player from room', () => {
    return request(app).post('/rooms/add').send({ username: "Test User" }).expect(200).expect('Content-Type', /json/).then(response => {
      return request(app).post('/rooms/addPlayer').send({ username: "Test User 2", roomname: response.body.roomCode }).expect(200).expect('Content-Type', /json/).then(res => {
        return request(app).put('/rooms/leaveLobby').send({ room: response.body, user: "Test User 2" }).expect(200).expect('Content-Type', /json/).then(res2 => {
          return request(app).get('/rooms/getByRoomCode').query({ roomname: response.body.roomCode }).expect('Content-Type', /json/).then(res3 => {
            // player that was added should have been removed
            expect(res3.body.players.length).toEqual(1);
          });
        });
      });
    });
  })

  test('PUT method should not remove player from room', () => {
    return request(app).post('/rooms/add').send({ username: "Test User" }).expect(200).expect('Content-Type', /json/).then(response => {
      return request(app).post('/rooms/addPlayer').send({ username: "Test User 2", roomname: response.body.roomCode }).expect(200).expect('Content-Type', /json/).then(res => {
        return request(app).put('/rooms/leaveLobby').send({ room: response.body, user: "Test User Not 2" }).expect(200).expect('Content-Type', /json/).then(res2 => {
          return request(app).get('/rooms/getByRoomCode').query({ roomname: response.body.roomCode }).expect('Content-Type', /json/).then(res3 => {
            // player that was added should not have been removed
            expect(res3.body.players.length).toEqual(2);
          });
        });
      });
    });
  })
})