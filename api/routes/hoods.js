const express = require("express");
const router = express.Router();

const hoodsController = require('../controllers/hoods');

// gets regions
router.get("/", hoodsController.hoods_get_all);

// add regions obj
router.post("/", hoodsController.hoods_create_hoods);

module.exports = router;
