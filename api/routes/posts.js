const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const PostsController = require('../controllers/posts');

// gets all posts
router.get("/", PostsController.posts_get_all);

// creates new post
router.post("/", checkAuth, PostsController.posts_create_post);

//finds post by ID
router.get("/:postId", PostsController.posts_get_post);

// updates post by ID
router.patch("/:postId", checkAuth, PostsController.posts_update_post);

// deletes post by ID
router.delete("/:postId", checkAuth, PostsController.posts_delete_post);

module.exports = router;
