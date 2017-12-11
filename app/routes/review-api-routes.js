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
    app.get("/review/:location", function(req, res) {
        var query = {};
        if (req.params.location) {
            query.location = req.params.location;
        }
        // 1. Add a join here to include all of the Authors to these review
        db.Review.findAll({
            include: [{
                model: db.Author,
                where: query
            }]
        }).then(function(result) {
            res.render("landmark", result);
        });
    });

    // POST route for saving a new post
    app.post("/review/add", function(req, res) {
        db.Review.create({
            location: req.body.location,
            title: req.body.title,
            body: req.body.body,
            rating: req.body.rating
        }).then(function(result) {
            res.render("landmark", result);
        });
    });


    // PUT route for updating review
    app.put("/api/review/update/:id", function(req, res) {
        db.Review.update(
            req.body, {
                where: {
                    id: req.params.id
                }
            }).then(function(result) {
            res.render("landmark", result);
        });
    });
    //sort by top voted reiews
    app.get("/api/sort/top/:location", function(req, res) {
        var query = {};
        if (req.params.location) {
            query.location = req.params.location;
        }
        db.Review.findAll({
            include: [{
                model: db.Author,
                where: query,
                order: sequelize.col('rating')
            }]
        }).then(function(result) {
            res.render("landmark", result);
        })
    });

    //sort by recent reviews
    app.get("/api/sort/recent/:location", function(req, res) {
        var query = {};
        if (req.params.location) {
            query.location = req.params.location;
        }
        db.Review.findAll({
            include: [{
                model: db.Author,
                where: query,
                order: sequelize.col('timestamps')
            }]
        }).then(function(result) {
            res.render("landmark", result);
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
            res.render("landmark", result);
        });
    });

};