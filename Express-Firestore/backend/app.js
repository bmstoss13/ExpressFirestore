// Import the express module
const express=require('express');
const cors = require('cors');
const { db } = require('./firebase');
require('dotenv').config();
// Create an instance of the express application
const app=express();
// Specify a port number for the server
const port=3000;

// use middleware to parse json request bodies
app.use(cors())
app.use(express.json());

const postsRoute = require("./routes/posts");

app.use("/posts", postsRoute);

app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

// Start the server and listen to the port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
