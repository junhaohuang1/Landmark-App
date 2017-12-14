var express = require("express");
var connect = require("connect");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var path = require("path");
var exphbs = require("express-handlebars");
var app = express();
var http = require('http');
var server = http.createServer(app);
var twit = require('twit');
var io = require('socket.io').listen(server);

var PORT = process.env.PORT || 3000;

app.use(methodOverride("_method"));

// Sets up the Express App
// =============================================================

// Requiring our models for syncing
var db = require("./models");

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.json({
  type: "application/vnd.api+json"
}));
app.use(bodyParser.urlencoded({
  extended: true
}));


// Routes
// =============================================================
// require("./routes/author-api-routes.js")(app);
// require("./routes/html-routes.js")(app);
require("./routes/review-api-routes.js")(app);

app.use(express.static("public"));

app.use(methodOverride("_method"));
app.engine("handlebars", exphbs({
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");
// Syncing our sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync({
  force: false
}).then(function() {
  server.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});

var watchList = [];

app.get('/tweets', function(req, res) {
  watchList = [];
  watchList.push(req.body.place);
  res.render("map");
});

var T = new twit({
  consumer_key: 'gxe3kwcWCKdhd4AjLwBy8qJbK',
  consumer_secret: '9JwPuh5ohep3tBrG37XmYk0YtBV4yShvNFTNKJ3Jgt0HFVh3M4',
  access_token: '4710469953-L5wvi9Iy4z0AfYoBbzPnykI00sS71mx2HsmtK98',
  access_token_secret: 'Kc021mJBDi8YtOaUXUrBtYyurXoOqtfc59EMHHVsw42lO',
})




io.sockets.on('connection', function(socket) {
  console.log("i m running")
  console.log(watchList);
  T.stream('statuses/filter', {
    track: watchList
  }, function(stream) {
    stream.on('tweet', function(tweet) {
      console.log(tweet);
      io.sockets.emit('tweet', tweet);
    });
  });
});


// Data
//
// var express = require("express");
// var app = express();
// var landmark = [
//
// ];
//
// app.get("/", function(req,res){
//   return res.render("landmark")
// });
//
// // Routes
// app.get("/landmark/:name", function(req, res) {
//   for (var i = 0; i < landmark.length; i++) {
//     if (landmark[i].name === req.params.name) {
//       return res.render("landmark", landmark[i]);
//     }
//   }
// });
//
// app.get("/landmark", function(req, res) {
//   res.render("ics", { ics: landmark });
// });
//
// //update Reviews
// app.post("/landmark/add", function(req,res){
//   res.render("some placeholder", {review: review})
// })
