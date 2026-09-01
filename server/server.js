const express = require("express");
const cors = require("cors");

const app = express();

const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const authMiddleware = require("./middleware/authMiddleware");

app.use(cors());
app.use(express.json());

app.use("/images", express.static("images"));

app.use(logger);

app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);
app.use("/users", userRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

app.get("/protected", authMiddleware, (req, res) => {
    res.json({
        message: "You have access to this protected route",
        user: req.user
    });
});

app.use((req, res) => {
    res.status(404).json({
        error: "Route not found"
    });
});

app.use(errorHandler);

app.listen(3000, () => {
    console.log("Server running");
});