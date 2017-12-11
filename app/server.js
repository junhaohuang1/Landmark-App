var express = require("express");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var path = require("path");
var exphbs = require("express-handlebars");
var app = express();

var PORT = process.env.PORT || 3000;

app.use(methodOverride("_method"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// Sets up the Express App
// =============================================================

// Requiring our models for syncing
var db = require("./models");

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Static directory
app.use(express.static("public"));

// Routes
// =============================================================
require("./routes/html-routes.js")(app);
require("./routes/author-api-routes.js")(app);
require("./routes/review-api-routes.js")(app);


// Syncing our sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync({ force: true }).then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
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
