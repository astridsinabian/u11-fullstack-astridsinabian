const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');


// Configures enviroment varibles in dotenv-file
require('dotenv').config();

// Creates express server
const app = express();
const port = process.env.PORT || 5000;


// Middleware and allows to parse json
app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB connection established succesfully!");
})


const usersRouter = require('./routes/users');

app.use('/users', usersRouter);

// What starts the server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});