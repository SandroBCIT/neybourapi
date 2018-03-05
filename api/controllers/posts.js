const mongoose = require("mongoose");

const Post = require("../models/post");

exports.posts_get_all = (req, res, next) => {
    Post.find()
    .select("_id title body coords toggle region")
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            posts: docs.map(doc => {
                return {
                    _id: doc._id,
                    title: doc.title,
                    body: doc.body,
                    coords: doc.coords,
                    region: doc.region,
                    toggle: doc.toggle
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
        title: req.body.title,
        body: req.body.body,
        coords: req.body.coords,
        region: req.body.region,
        toggle: req.body.toggle, 
    });
    post
    .save()
    .then(result => {
        res.status(201).json({
            message: "Created post successfully",
            createdPost: {
                _id: result._id,
                title: result.title,
                body: result.body,
                coords: result.coords,
                region: result.region,
                toggle: result.toggle
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
    .select('_id title body coords toggle')
    .exec()
    .then(doc => {
        if (doc) {
            res.status(200).json({
                post: doc
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
            message: 'Post updated'
        });
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
}

exports.posts_delete_post = (req, res, next) => {
    Post.remove({ _id: req.params.postId })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Post deleted',
        });
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
}