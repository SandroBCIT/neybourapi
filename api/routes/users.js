const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const UserController = require('../controllers/users');

// gets all users
router.get("/", UserController.users_get_all);

// signup user
router.post("/signup", UserController.users_signup_user);

// login user
router.post("/login", UserController.users_login_user);

// delete user
router.delete("/:userId", checkAuth, UserController.users_delete_user);

//update user posts
router.patch("/:userId", checkAuth, UserController.users_update_userPosts);

//finds user by ID
router.get("/:userId", UserController.users_get_user);
//add check auth later

module.exports = router;