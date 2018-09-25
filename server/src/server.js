const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const mongoose = require('mongoose');

const dbConfig = require('./config/db');
const UserRoutes = require('./routes/user.routes');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(cors());
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
}));

mongoose.Promise = global.Promise;

mongoose.connect(dbConfig);

mongoose.connection.on('error', () => {
  console.log("Couldn't connect to the database.");
  process.exit();
});

mongoose.connection.once('open', () => {
  console.log('Connected.');
});

app.get('/', (req, res) => {
  res.send('Index page');
});

app.get('/index', (req, res) => {
  res.redirect('/');
});

UserRoutes(app);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
