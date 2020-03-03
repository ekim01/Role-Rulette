const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Connects to mongoDB
const path = require('path');

require('dotenv').config(); // Set ENV files from .env file

const app = express();

/* Middleware */
app.use(cors());
app.use(express.json()); // Parse JSON, because we send and receive

/* Database Init */
const uri = process.env.ATLAS_URI; // From the MongoDB Atlas dashboard
mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB connection established")
})

/* Sets router paths for API calls */
// Loads router from other files
const roomsRouter = require('./routes/rooms');
const playersRouter = require('./routes/players');
// Adds router as middleware
app.use('/rooms', roomsRouter);
app.use('/players', playersRouter);

/* All other paths not used for API calls are used to display pages in our application */
// Serves Static Assets in production 
app.use(express.static('../client/build'));
// Launches latest react build (from npm run build)
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
});

module.exports = app;