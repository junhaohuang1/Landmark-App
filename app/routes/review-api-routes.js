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
    if (req.query.author_id) {
      query.AuthorId = req.query.author_id;
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

  // Get rotue for retrieving a single post
  app.get("/api/review/:id", function(req, res) {
    // 2. Add a join here to include the Author who wrote the Review
    db.Review.findOne({
      include:[{
        model:db.Author,
        where:{
          id: req.params.id
        }
      }]
    }).then(function(result) {
      console.log(result);
      res.json(result);
    });
  });

  // POST route for saving a new post
  app.post("/api/review", function(req, res) {
    db.Review.create(req.body).then(function(result) {
      res.json(result);
    });
  });

  // DELETE route for deleting review
  app.delete("/api/review/:id", function(req, res) {
    db.Review.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(result) {
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

  app.get("/api/sort/top",function(req, res){
    db.Review.findAll({
      include:[{
        model: db.Author,
        where: query,
        order: sequelize.col('rating')
      }]
    });
  };

};
