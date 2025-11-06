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
                    const favoriteCampsitesIds = favorite.campsites.map((campsite) =>
                        campsite._id.toString()
                    );
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
                    Favorite.create({ user: req.user._id, campsites: req.body })
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
        const err = new Error(`Put operation not supported on /favorites`);
        err.status = 403;
        return next(err);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOneAndDelete({ user: req.user._id })
            .then((favorite) => {
                if (favorite) {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(favorite);
                } else {
                    const err = new Error(`You do not have any favorites to delete`);
                    err.status = 404;
                    return next(err);
                }
            })
            .catch((err) => next(err));
    });

favoriteRouter
    .route("/:campsiteId")
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        const err = new Error(`Get operation not supported on /favorites/:campsiteId`);
        err.status = 403;
        return next(err);
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        const campsideId = req.params.campsiteId;
        Favorite.findOne({ user: req.user._id })
            .then((favorite) => {
                if (favorite) {
                    let found = false;
                    favorite.campsites.forEach((campsite) => {
                        if (campsite._id.toString() === campsideId) {
                            found = true;
                            const err = new Error(
                                `That campsite is already in the list of favorites!`
                            );
                            err.status = 403;
                            return next(err);
                        }
                    });

                    if (!found) {
                        favorite.campsites.push(campsideId);
                        favorite.save().then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(favorite);
                        });
                    }
                } else {
                    Favorite.create({ user: req.user._id, campsites: req.body })
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
        const err = new Error(`Put operation not supported on /favorites/:campsiteId`);
        err.status = 403;
        return next(err);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        const campsideId = req.params.campsiteId;

        Favorite.findOne({ user: req.user._id })
            .then((favorite) => {
                if (favorite) {
                    const indexToRemove = favorite.campsites.findIndex((campsite) => {
                        return campsite._id.toString() === campsideId;
                    });

                    console.log("index", indexToRemove);
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
                    /*
                    let found = false;
                    favorite.campsites.forEach((campsite) => {
                        if (campsite._id.toString() === campsideId) {
                            found = true;



                            favorite
                                .save()
                                .then((favorite) => {
                                    res.statusCode = 200;
                                    res.setHeader("Content-Type", "application/json");
                                    res.json(favorite);
                                })
                                .catch((err) => next(err));
                        }
                    });

                    if (!found) {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "text/plain");
                        res.end(`You have no favorite saved for campsite id ${campsideId}`);
                    }
*/
                } else {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "text/plain");
                    res.end("You do not have any favorites to delete");
                }
            })
            .catch((err) => next(err));
    });

module.exports = favoriteRouter;
