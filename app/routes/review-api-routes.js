// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {

  app.get("/", function(req, res) {
    res.render("map");

  });


  app.get("/review/:coordinates", function(req, res) {
  // replace old function with sequelize function
  db.Review.findAll({
    where:{
        location: req.params.coordinates
    }
  })
  .then(function(data) {
    // into the main index, updating the page
    console.log("found something");
    var hbsObject = {
      reviews: data
    };
    res.render("reviews", hbsObject);
  });
});

  // POST route for saving a new post
  app.post("/review/add", function(req, res) {
    console.log(req.body);
    db.Review.create({
      location: req.body.location,
      author: req.body.author,
      title: req.body.title,
      body: req.body.body
    }).then(function(result) {
      console.log(result);
      res.render("index", result);
    })
  });


  // PUT route for updating review
  app.put("/api/review/update/:id", function(req, res) {
    db.Review.update(
      req.body, {
        where: {
          id: req.params.id
        }
      }).then(function(result) {
      res.render("index", result);
    });
  });
  //sort by top voted reiews
  app.get("/api/sort/top/:coordinates", function(req, res) {
    var query = {};
    if (req.params.coordinates) {
      query.coordinates = req.params.coordinates;
    }
    db.Review.findAll({
      include: [{
        model: db.Author,
        where: query,
        order: [
          ["rating", "DESC"]
        ]
      }]
    }).then(function(result) {
      res.render("index", result);
    })
  });
  //sort by least voted reviews
  app.get("/api/sort/least/:coordinates", function(req, res) {
    var query = {};
    if (req.params.coordinates) {
      query.coordinates = req.params.coordinates;
    }
    db.Review.findAll({
      include: [{
        model: db.Author,
        where: query,
        order: [
          ["rating", "ASC"]
        ]
      }]
    }).then(function(data) {
      var hbsObject = {
        reviews: data
      };
      res.render("index", hbsObject);
    })
  });

  //sort by recent reviews
  app.get("/api/sort/recent/:coordinates", function(req, res) {
    var query = {};
    if (req.params.coordinates) {
      query.coordinates = req.params.coordinates;
    }
    db.Review.findAll({
      include: [{
        model: db.Author,
        where: query,
        order: [
          ["timestamps", "ASC"]
        ]
      }]
    }).then(function(data) {
      var hbsObject = {
        reviews: data
      };
      res.render("index", hbsObject);
    })
  });
  //update the rating of the review
  app.put("/api/rating/:id", function(req, res) {
    db.Review.update(
      req.body, {
        where: {
          id: req.params.id
        }
      }).then(function(result) {
      res.render("index", result);
    });
  });

};
