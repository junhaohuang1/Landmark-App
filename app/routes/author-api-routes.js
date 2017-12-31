var db = require("../models");

module.exports = function(app) {
    app.get("/api/authors", function(req, res) {
        // 1. Add a join to include all of each Author's Posts
        db.Author.findAll({}).then(function(result) {
            res.json(result);
        });
    });

    app.get("/api/authors/:id", function(req, res) {
        // 2; Add a join to include all of the Author's Posts here
        db.Author.findOne({
            where: {
                id: req.params.id
            }
        }).then(function(result) {
            res.json(result);
        });
    });

    app.post("/api/authors", function(req, res) {
        db.Author.create(req.body).then(function(result) {
            res.json(result);
        });
    });

    app.delete("/api/authors/:id", function(req, res) {
        db.Author.destroy({
            where: {
                id: req.params.id
            }
        }).then(function(result) {
            res.json(result);
        });
    });

};