const express = require("express");

const router = express.Router();

const {
    checkout, 
    getOrders,
    getOrderById
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getOrders);
router.get("/:id", authMiddleware, getOrderById)
router.post("/checkout", authMiddleware, checkout);

module.exports = router;