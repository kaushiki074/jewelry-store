const db = require("../db");

const getCategories = (req, res, next) => {
    const sql = "SELECT * FROM categories";

    db.query(sql, (err, results) => {
        if (err) {
           return next(err);
        }
        res.json(results);
    });
};

const getProductsByCategory = (req, res, next) => {
    const category_id = req.params.category_id;

    const sql = "SELECT * FROM products WHERE category_id = ?";

    db.query(sql, [category_id], (err, results) => {
        if (err) {
            return next(err);
        }
        res.json(results);
    });
};

module.exports = {
    getCategories,
    getProductsByCategory
}