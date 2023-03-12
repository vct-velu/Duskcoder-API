const mongoose = require('mongoose');
const dotenv = require('dotenv');
const mongodb_uri = process.env.MONGODB_URI;


async function connectDatabase() {

mongoose.connect(mongodb_uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to Database - MongoDB');
    })
    .catch((err) => {
        console.log('Error connecting to MongoDB', err);
    });
  }



module.exports = { connectDatabase };