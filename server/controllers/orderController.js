const db = require("../db");

const checkout = (req, res, next) => {
    const userId = req.user.userId;

    const cartSql = `
        SELECT
            cart.product_id,
            cart.quantity,
            products.price
        FROM cart
        JOIN products
        ON cart.product_id = products.id
        WHERE cart.user_id = ?
    `;

    db.query(cartSql, [userId], (err, cartItems) => {
        if (err) {
            return next(err);
        }

        if (cartItems.length === 0) {
            return res.status(400).json({
                error: "Cart is empty"
            });
        }

        let totalAmount = 0;

        cartItems.forEach((item) => {
            totalAmount += Number(item.price) * item.quantity;
        });

        const orderSql = `
            INSERT INTO orders (user_id, total_amount)
            VALUES (?, ?)
        `;

        db.query(
            orderSql,
            [userId, totalAmount],
            (err, orderResult) => {
                if (err) {
                    return next(err);
                }

                const orderId = orderResult.insertId;

                const orderItemsSql = `
                    INSERT INTO order_items
                    (order_id, product_id, quantity, price)
                    VALUES ?
                `;

                const values = cartItems.map((item) => [
                    orderId,
                    item.product_id,
                    item.quantity,
                    item.price
                ]);

                db.query(
                    orderItemsSql,
                    [values],
                    (err) => {
                        if (err) {
                            return next(err);
                        }

                        const clearCartSql = `
                            DELETE FROM cart
                            WHERE user_id = ?
                        `;

                        db.query(
                            clearCartSql,
                            [userId],
                            (err) => {
                                if (err) {
                                    return next(err);
                                }

                                res.status(201).json({
                                    message: "Order placed successfully",
                                    orderId,
                                    totalAmount
                               });
                            }
                        );
                    }
                );
            }
        );
    });
};

const getOrders = (req, res, next) => {
    const userId = req.user.userId;

    const sql = `
        SELECT *
        FROM orders
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            return next(err);
        }

        res.json(results);
    });
};

const getOrderById = (req, res, next) => {
    const userId = req.user.userId;
    const orderId = req.params.id;

    const sql = `
        SELECT
            orders.id AS order_id,
            orders.total_amount,
            orders.status,
            orders.created_at,
            order_items.product_id,
            order_items.quantity,
            order_items.price,
            products.name,
            products.image_url
        FROM orders
        JOIN order_items
            ON orders.id = order_items.order_id
        JOIN products
            ON order_items.product_id = products.id
        WHERE orders.id = ?
        AND orders.user_id = ?
    `;

    db.query(
        sql,
        [orderId, userId],
        (err, results) => {
            if (err) {
                return next(err);
            }

            if (results.length === 0) {
                return res.status(404).json({
                    error: "Order not found"
                });
            }

            res.json(results);
        }
    );
};

module.exports = {
    checkout, 
    getOrders,
    getOrderById
};