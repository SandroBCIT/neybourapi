const mongoose = require("mongoose");

const Post = require("../models/post");

exports.posts_get_all = (req, res, next) => {
    Post.find()
    .select("name price _id")
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            posts: docs.map(doc => {
                return {
                    _id: doc._id,
                    name: doc.name,
                    price: doc.price,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/posts/" + doc._id
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

exports.posts_create_post = (req, res, next) => {
    const post = new Post({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price 
    });
    post
    .save()
    .then(result => {
        res.status(201).json({
            message: "Created post successfully",
            createdPost: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: "http://localhost:3000/posts/" + result._id
                }
            }
        });
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
}

exports.posts_get_post = (req, res, next) => {
    const id = req.params.postId;
    Post.findById(id)
    .select('name price _id')
    .exec()
    .then(doc => {
        if (doc) {
            res.status(200).json({
                post: doc,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/posts'
                }
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

exports.posts_update_post = (req, res, next) => {
    const id = req.params.postId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Post.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Post updated',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/posts/' + id
            }
        });
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
}

exports.posts_delete_post = (req, res, next) => {
    const id = req.params.posttId;
    Post.remove({ _id: id })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Post deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/posts',
                body: { name: 'String', price: 'Number' }
            }
        });
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
}