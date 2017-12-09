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

  // GET route for getting all of the review
  app.get("/api/review", function(req, res) {
    var query = {};
    if (req.query.location) {
      query.location = req.query.location;
    }
    // 1. Add a join here to include all of the Authors to these review
    db.Review.findAll({
      include:[{
        model: db.Author,
        where: query
      }]
    }).then(function(result) {
      res.json(result);
    });
  });


  // POST route for saving a new post
  app.post("/api/review", function(req, res) {
    db.Review.create(req.body).then(function(result) {
      res.json(result);
    });
  });


  // PUT route for updating review
  app.put("/api/review", function(req, res) {
    db.Review.update(
      req.body,
      {
        where: {
          id: req.body.id
        }
      }).then(function(result) {
        res.json(result);
      });
  });
  //sort by top voted reiews
  app.get("/api/sort/top",function(req, res){
    db.Review.findAll({
      include:[{
        model: db.Author,
        where: query,
        order: sequelize.col('rating')
      }]
    });
  });
  
  //sort by recent reviews
  app.get("/api/sort/recent",function(req, res){
    db.Review.findAll({
      include:[{
        model: db.Author,
        where: query,
        order: sequelize.col('timestamps')
      }]
    });
  });

};
