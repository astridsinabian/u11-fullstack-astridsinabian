const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 5000;
const path = require("path");

const authRoute = require("./routes/auth");
const tweets = require("./routes/tweets");
const adminRoute = require("./routes/admin");

// Configures enviroment varibles in dotenv-file
dotenv.config();

app.use(cors());

// Connect to DB
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useCreateIndex: true },
  () => console.log("MongoDB connection established succesfully!")
);

// Middlewares
app.use(express.json());

// Route middlewares
app.use("/api/user", authRoute);
app.use("/api/tweets", tweets);
app.use("/api/admin", adminRoute);

  app.use(express.static("../client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../", "client", "build", "index.html"));
  });


// What starts the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
