const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
        INSERT INTO users (name, email, password)
        VALUES (?, ?, ?)
        `;

        db.query(
            sql,
            [name, email, hashedPassword],
            (err, results) => {
                if (err) {
                    return next(err);
                }

                res.status(201).json({
                    message: "User registered successfully",
                    userId: results.insertId
                });
            }
        );

    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const sql = "SELECT * FROM users WHERE email = ?";

        db.query(sql, [email], async (err, results) => {
            if (err) {
                return next(err);
            }

            if (results.length === 0) {
                return res.status(401).json({
                    error: "Invalid email or password"
                });
            }

            const user = results[0];

            const isPasswordCorrect = await bcrypt.compare(
                password,
                user.password
            );

            if (!isPasswordCorrect) {
                return res.status(401).json({
                    error: "Invalid email or password"
                });
            }

            const token = jwt.sign (
                {
                    userId: user.id,
                    role: user.role
                },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            res.json({
                message: "Login successful",
                token
            });
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    signup, 
    login
};