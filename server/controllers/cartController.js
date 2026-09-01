const db = require("../db");

const getCart = (req, res, next) => {
    const userId = req.user.userId;

    const sql = `
        SELECT 
            cart.id,
            cart.product_id,
            cart.quantity,
            products.name,
            products.price,
            products.image_url
        FROM cart
        JOIN products
        ON cart.product_id = products.id
        WHERE cart.user_id = ?
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            return next(err);
        }

        res.json(results);
    });
};

const addToCart = (req, res, next) => {
    const userId = req.user.userId;
    const { product_id, quantity } = req.body;

    const checkSql = `
        SELECT * FROM cart
        WHERE user_id = ? AND product_id = ?
    `;

    db.query(
        checkSql,
        [userId, product_id],
        (err, results) => {
            if (err) {
                return next(err);
            }

            if (results.length > 0) {
                const newQuantity =
                    results[0].quantity + (quantity || 1);

                const updateSql = `
                    UPDATE cart
                    SET quantity = ?
                    WHERE user_id = ? AND product_id = ?
                `;

                db.query(
                    updateSql,
                    [newQuantity, userId, product_id],
                    (err) => {
                        if (err) {
                            return next(err);
                        }

                        return res.json({
                            message: "Cart quantity updated"
                        });
                    }
                );

            } else {
                const insertSql = `
                    INSERT INTO cart
                    (user_id, product_id, quantity)
                    VALUES (?, ?, ?)
                `;

                db.query(
                    insertSql,
                    [userId, product_id, quantity || 1],
                    (err, result) => {
                        if (err) {
                            return next(err);
                        }

                        res.status(201).json({
                            message: "Product added to cart",
                            cartId: result.insertId
                        });
                    }
                );
            }
        }
    );
};

const updateCart = (req, res, next) => {
    const userId = req.user.userId;
    const productId = req.params.productId;
    const { quantity } = req.body;

    const sql = `
        UPDATE cart
        SET quantity = ?
        WHERE user_id = ? AND product_id = ?
    `;

    db.query(
        sql,
        [quantity, userId, productId],
        (err, result) => {
            if (err) {
                return next(err);
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error: "Product not found in cart"
                });
            }

            res.json({
                message: "Cart updated successfully"
            });
        }
    );
};

const deleteFromCart = (req, res, next) => {
    const userId = req.user.userId;
    const productId = req.params.productId;

    const sql = `
        DELETE FROM cart
        WHERE user_id = ? AND product_id = ?
    `;

    db.query(
        sql,
        [userId, productId],
        (err, result) => {
            if (err) {
                return next(err);
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error: "Product not found in cart"
                });
            }

            res.json({
                message: "Product removed from cart"
            });
        }
    );
};

module.exports = {
    getCart,
    addToCart,
    updateCart,
    deleteFromCart
};