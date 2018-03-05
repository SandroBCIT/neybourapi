const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.users_get_all = (req, res, next) => {
    User.find()
    .select("_id email password name posts")
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            users: docs.map(doc => {
                return {
                    _id: doc._id,
                    email: doc.email,
                    password: doc.password,
                    name: doc.name,
                    posts: doc.posts,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/users/" + doc._id
                    }
                };
            })
        };
        //   if (docs.length >= 0) {
        res.status(200).json(response);
        //   } else {
        //       res.status(404).json({
        //           message: 'No entries found'
        //       });
        //   }
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
}

exports.users_signup_user = (req, res, next) => {
    User.find({ email: req.body.email })
    .exec()
    .then(user => {
        //checks if email already exists
        if (user.length >= 1) {
            return res.status(409).json({
                message: "Email already exists"
            });
        } else {
            // encrypts PW
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({ error: err });
                } else {
                    // creates new user 
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash,
                        name: req.body.name
                    });
                    user
                    .save()
                    .then(result => {
                        res.status(201).json({
                            message: "User created"
                        });
                    })
                    .catch(err => {
                        res.status(500).json({ error: err });
                    });
                }
            });
        }
    });
}

exports.users_login_user = (req, res, next) => {
    User.find({ email: req.body.email })
    .exec()
    .then(user => {
        if (user.length < 1) {
            return res.status(401).json({
                message: "Auth failed"
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            if (result) {
                const token = jwt.sign(
                    {
                        email: user[0].email,
                        userId: user[0]._id
                    },
                        "secret",
                    {
                        expiresIn: "1h"
                    }
                );
                return res.status(200).json({
                    message: "Auth successful",
                    userId: user[0].id,
                    posts: user[0].posts,
                    token: token
                });
            }
            res.status(401).json({
                message: "Auth failed"
            });
        });
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
}

exports.users_delete_user = (req, res, next) => {
    User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
        res.status(200).json({
            message: "User deleted"
        });
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
}

exports.users_update_userPosts = (req, res, next) => {
    const id = req.params.userId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Post.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Posts array updated',
            request: {
                type: 'GET',
                url: 'http://localhost:4567/posts/' + id
            }
        });
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
}

exports.users_get_user = (req, res, next) => {
    const id = req.params.userId;
    User.findById(id)
    .select('_id email name posts')
    .exec()
    .then(doc => {
        if (doc) {
            res.status(200).json({
                user: doc
            });
        } else {
            res
            .status(404)
            .json({ message: "No valid entry found for provided ID" });
        }
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
}