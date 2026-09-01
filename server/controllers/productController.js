const db = require("../db");

const getProducts = (req, res, next) => {
    const sql = "SELECT * FROM products";

    db.query(sql, (err, results) => {
        if (err) {
            return next(err);
        }
        res.json(results);
    });
};

const getProductById = (req, res, next) => {
    const id = req.params.id;

    const sql = "SELECT * FROM products WHERE id = ?";

    db.query(sql, [id], (err, results) => {
        if (err) {
            return next(err);
        }

        if (results.length === 0) {
            return res.status(404).json({
                error: "Product not found"
            });
        }

        res.json(results[0]);
    });
};

const addProduct = (req, res, next) => {
    const { name, price, description, image, category_id } = req.body;

    const sql = `
        INSERT INTO products
        (name, price, description, image_url, category_id)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [name, price, description, image, category_id],
        (err, result) => {
            if (err) {
                console.log(err);

                return next(err);
            }

            res.status(201).json({
                message: "Product added successfully",
                productId: result.insertId
            });
        }
    );
};

const updateProduct = (req, res, next) => {
    const id = req.params.id;

    const { name, price, description, image, category_id } = req.body;

    const sql = `
        UPDATE products
        SET name = ?, price = ?, description = ?, image_url = ?, category_id = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [name, price, description, image, category_id, id],
        (err, result) => {
            if (err) {
                console.log(err);

                return next(err);
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error: "Product not found"
                });
            }

            res.json({
                message: "Product updated successfully"
            });
        }
    );
};

const deleteProduct = (req, res, next) => {
    const id = req.params.id;

    const sql = "DELETE FROM products WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log(err);
            return next(err);
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Product not found"
            });
        }

        res.json({
            message: "Product deleted successfully"
        });
    });
};

module.exports = {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
};