const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const ProductsController = require('../controllers/products');

// gets all products
router.get("/", ProductsController.products_get_all);

// creates new product
router.post("/", checkAuth, ProductsController.products_create_product);

//finds product by ID
router.get("/:productId", ProductsController.products_get_product);

// updates product by ID
router.patch("/:productId", checkAuth, ProductsController.products_update_product);

// deletes product by ID
router.delete("/:productId", checkAuth, ProductsController.products_delete_product);

module.exports = router;
