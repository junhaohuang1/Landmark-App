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
app.set('views', __dirname + '/views');
app.engine("handlebars", exphbs({
  defaultLayout: "main",
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

var T = new twit({
  consumer_key: 'gxe3kwcWCKdhd4AjLwBy8qJbK',
  consumer_secret: '9JwPuh5ohep3tBrG37XmYk0YtBV4yShvNFTNKJ3Jgt0HFVh3M4',
  access_token: '4710469953-L5wvi9Iy4z0AfYoBbzPnykI00sS71mx2HsmtK98',
  access_token_secret: 'Kc021mJBDi8YtOaUXUrBtYyurXoOqtfc59EMHHVsw42lO',
});

var stream = null, // Define global stream holder as we will only ever have ONE active stream
  currentKeyword = null; // Hold the current keyword we are streaming


function createStream(keyword) {
  stream = T.stream('statuses/filter', {
    track: keyword
  }); // Defines a new stream tracked by the keyword

  stream.on('tweet', function(tweet) {
    io.sockets.emit('twitter-stream', tweet);
  });

  stream.on('connect', function() { // Log a new connection to the stream
    console.log('Connected to twitter stream using keyword => ' + keyword);
  });

  stream.on('disconnect', function() // Log a disconnection from the stream
    {
      console.log('Disconnected from twitter stream using keyword => ' + keyword);
    });

  return stream; // Return the stream
}

io.sockets.on('connection', function(socket) {
  console.log("connected");
  socket.on('keyword-change', function(keyword){ // On a keyword change request from the client
      if (stream !== null){// If the stream is currently running
        stream.stop(); // Stop the current stream
        console.log('Stream Stopped'); // Log a message
      }
      stream = createStream(keyword); // Create a new stream using the keyword passed from the client

      currentKeyword = keyword; // Set the currentKeyword holder to the passed keyword

      io.sockets.emit('keyword-changed', currentKeyword); // Emit an event to ALL clients passing through the new keyword

      console.log('Stream restarted with keyword => ' + currentKeyword); // Log a message
    });
});
>>>>>>> 314df082423cec1589cebf845c97e502e32de651
