const validateProduct = (req, res, next) => {
    const { name, price, description, category_id } = req.body;

    if (!name || !price || !description || !category_id) {
        return res.status(400).json({
            error: "All required fields must be provided"
        });
    }

    if (price <= 0) {
        return res.status(400).json ({
            error: "Price mustbe greater than 0"
        });
    }
    
    next();
};

module.exports = validateProduct;