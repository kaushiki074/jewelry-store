const express = require("express");

const router = express.Router();

const {
    getCategories,
    getProductsByCategory
} = require("../controllers/categoryController");

router.get("/", getCategories);

router.get("/:category_id/products", getProductsByCategory);

module.exports = router;