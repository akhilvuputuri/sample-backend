const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const userRoutes = require("./userRoutes");

const PORT = process.env.PORT || 3001;

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const CONNECTION_STRING = 'mongodb+srv://akhilvuputuri:kXDnzJPBzMbzY7AU@cluster0.3mrkx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
mongoose.connect(CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));
db.once('open', () => {
  console.log('MongoDB connection established');
});

app.get('/', (req, res) => {
  res.send('Testing route')
});

app.use('/', userRoutes);

app.listen(PORT, () => {
  console.log("Listening on port: ", PORT)
})

module.exports = app;