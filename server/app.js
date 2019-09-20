const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 5000;
const authRoute = require('./routes/auth');

// Configures enviroment varibles in dotenv-file
dotenv.config();

app.use(cors());

// Connect to DB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useCreateIndex: true }, () => 
    console.log("MongoDB connection established succesfully!")
);

// Middlewares
app.use(express.json());

// Route middlewares
app.use('/api/user', authRoute);

// What starts the server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

