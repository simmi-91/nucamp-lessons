const express = require("express");
const Favorite = require("../models/favorite");
const authenticate = require("../authenticate");
const cors = require("./cors");

const favoriteRouter = express.Router();

favoriteRouter
    .route("/")
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorite.find({ user: req.user._id })
            .populate("user")
            .populate("campsites")
            .then((favorite) => {
                if (favorite) {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(favorite);
                } else {
                    const err = new Error(`You do not have any favorites yet!`);
                    err.status = 404;
                    return next(err);
                }
            })
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then((favorite) => {
                if (favorite) {
                    const favoriteCampsitesIds = favorite.campsites.toString().split(",");
                    const newCampsiteIds = req.body.map((item) => item._id.toString());

                    if (Array.isArray(newCampsiteIds)) {
                        const favoriteCampsites = favorite.campsites;
                        newCampsiteIds.forEach((id) => {
                            if (!favoriteCampsitesIds.includes(id)) {
                                favoriteCampsites.push(id);
                            }
                        });
                        favorite.campsites = favoriteCampsites;
                        favorite.save().then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(favorite);
                        });
                    } else {
                        const err = new Error(`Campsite IDs should be an array`);
                        err.status = 404;
                        return next(err);
                    }
                } else {
                    Favorite.create({
                        user: req.user._id,
                        campsites: req.bodyreq.body.map((item) => item._id),
                    })
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(favorite);
                        })
                        .catch((err) => next(err));
                }
            })
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.status(403).end(`Put operation not supported on /favorites`);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOneAndDelete({ user: req.user._id })
            .then((favorite) => {
                if (favorite) {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(favorite);
                } else {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "text/plain");
                    res.end("You do not have any favorites to delete");
                }
            })
            .catch((err) => next(err));
    });

favoriteRouter
    .route("/:campsiteId")
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        res.status(403).end(`Get operation not supported on /favorites/:campsiteId`);
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        const campsiteId = req.params.campsiteId;
        Favorite.findOne({ user: req.user._id })
            .then((favorite) => {
                if (favorite) {
                    let found = false;
                    favorite.campsites.forEach((campsite) => {
                        if (campsite.toString() === campsiteId) {
                            found = true;
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "text/plain");
                            res.end("That campsite is already in the list of favorites!");
                        }
                    });

                    if (!found) {
                        favorite.campsites.push(campsiteId);
                        favorite.save().then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(favorite);
                        });
                    }
                } else {
                    Favorite.create({ user: req.user._id, campsites: campsiteId })
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(favorite);
                        })
                        .catch((err) => next(err));
                }
            })
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.status(403).end(`Put operation not supported on /favorites/:campsiteId`);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        const campsiteId = req.params.campsiteId;

        Favorite.findOne({ user: req.user._id })
            .then((favorite) => {
                if (favorite) {
                    const indexToRemove = favorite.campsites.findIndex((campsite) => {
                        return campsite.toString() === campsiteId;
                    });

                    if (indexToRemove > -1) {
                        favorite.campsites.splice(indexToRemove, 1);
                        favorite
                            .save()
                            .then((favorite) => {
                                res.statusCode = 200;
                                res.setHeader("Content-Type", "application/json");
                                res.json(favorite);
                            })
                            .catch((err) => next(err));
                    } else {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "text/plain");
                        res.end("Campsite not found in favorites");
                    }
                } else {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "text/plain");
                    res.end("You do not have any favorites to delete");
                }
            })
            .catch((err) => next(err));
    });

module.exports = favoriteRouter;
