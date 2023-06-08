const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/auth");
const { createProduct, getProducts } = require("../controllers/product");

router.post("/products", authenticate, createProduct);
router.get("/products", authenticate, getProducts);

module.exports = router;
