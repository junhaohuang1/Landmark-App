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
