const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const productRoutes = require("./api/routes/products");
const cors = require('cors');

const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });

// Connect to MongoDb
const { connectDatabase } = require('./config/database');
const db = connectDatabase();

//Midlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());


// Routes which should handle requests
app.use('/api/product', productRoutes);


app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
  });
  
  app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message
      }
    });
  });
  
  module.exports = app;