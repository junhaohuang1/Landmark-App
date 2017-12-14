var express = require("express");
var exphbs = require("express-handlebars");

// Create an instance of the express app.
var app = express();

// Specify the port.
var port = 3000;

// Set Handlebars as the default templating engine.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Data
var landmark = [
  
];

//socket Io 
Twit = require('twit');
io = require('socket.io').listen(server);
var watchList = ['landmark'];
io.sockets.on('connection', function (socket) {
  console.log('Connected');

  var T = new Twit({
    consumer_key:         ''
  , consumer_secret:      ''
  , access_token:         ''
  , access_token_secret:  ''
})
 T.stream('statuses/filter', { track: watchList },function (stream) {

  stream.on('tweet', function (tweet) {

        io.sockets.emit('stream',tweet.text);
        console.log(tweet.text);

  });
 });
}); 



// Routes
app.get("/landmark/:name", function(req, res) {
  for (var i = 0; i < landmark.length; i++) {
    if (landmark[i].name === req.params.name) {
      return res.render("landmark", landmark[i]);
    }
  }
});

app.get("/landmark", function(req, res) {
  res.render("ics", { ics: landmark });
});

// Initiate the listener.
app.listen(port);
