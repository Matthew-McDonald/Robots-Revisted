'use strict'

const express = require('express');
const app = express();
const mustache = require('mustache-express');
// const robots = require('./data.js');
const mongoDB = require('mongodb').MongoClient;
const assert = require('assert');

const mongoURL = 'mongodb://127.0.0.1:27017/robodb';
var db;
var robots;

app.engine('mustache', mustache());
app.set('views', './public');
app.set('view engine', 'mustache');
app.use(express.static(__dirname));

mongoDB.connect(mongoURL, (err, database) => {
  if (err) return console.log(err);
  console.log("connected to mongodb");
  db = database;
  robots = db.collection('robots');
  app.listen(3000, function() {
    console.log("Express server started");
  });
})

app.get('/directory/employed', function(req, res) {
  console.log('filter by employed');
  robots.find({}).toArray((err, data) => {
    if (err) return console.log(err);
    data = data.filter(function(a) {
      return a.job !== null
    })
    res.render('employed.mustache', {users: data});
  })
});

app.get('/directory/unemployed', function(req, res) {
  console.log('filter by unemployed');
  robots.find({}).toArray((err, data) => {
    if (err) return console.log(err);
    data = data.filter((a) => {
      return a.job === null
    })
    res.render('employed.mustache', {users: data});
  })
});

app.get('/directory/', function(req, res) {
  console.log('access homepage');
  robots.find({}).toArray((err, data) => {
    if (err) return console.log(err);
    res.render('index.mustache', {users: data});
  })
});


app.get('/directory/:username', function(req, res) {
  console.log('access username:', req.params.username);
  robots.findOne({"username": req.params.username}, (err, data) => {
    if (err) return console.log(err);
    console.log(data);
    res.render('user.mustache', data);
  })
});
