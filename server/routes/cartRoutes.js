const express = require("express");

const router = express.Router();

const {
    getCart,
    addToCart, 
    updateCart, 
    deleteFromCart
} = require("../controllers/cartController");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getCart);
router.post("/", authMiddleware, addToCart);
router.put("/:productId", authMiddleware, updateCart)
router.delete("/:productId", authMiddleware, deleteFromCart);

module.exports = router;