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

const forgotPassword = (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      error: "Email is required"
    });
  }

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, results) => {
    if (err) {
      return next(err);
    }

    if (results.length === 0) {
      return res.json({
        message:
          "If an account with this email exists, a password reset link has been sent."
      });
    }

    const user = results[0];

    const token = crypto.randomBytes(32).toString("hex");

    const expiry = new Date(
      Date.now() + 15 * 60 * 1000
    );

    const updateSql = `
      UPDATE users
      SET reset_token = ?, reset_token_expiry = ?
      WHERE email = ?
    `;

    db.query(
      updateSql,
      [token, expiry, email],
      async (err) => {
        if (err) {
          return next(err);
        }

        const resetLink =
          `http://localhost:5173/reset-password/${token}`;

        const emailHTML = `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: auto; padding: 40px; color: #302b26;">

            <h1 style="text-align: center;">
              Jewelry Store
            </h1>

            <h2 style="text-align: center;">
              Reset Your Password
            </h2>

            <p>Hello ${user.name},</p>

            <p>
              We received a request to reset the password
              for your Jewelry Store account.
            </p>

            <p>
              Click the button below to create a new password.
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a
                href="${resetLink}"
                style="
                  display: inline-block;
                  padding: 14px 28px;
                  background: #302b26;
                  color: white;
                  text-decoration: none;
                "
              >
                Reset Password
              </a>
            </div>

            <p>
              This link will expire in 15 minutes.
            </p>

            <p>
              If you did not request a password reset,
              you can safely ignore this email.
            </p>

            <p>
              — Jewelry Store
            </p>

          </div>
        `;

        try {
          await sendEmail(
            email,
            "Reset Your Jewelry Store Password",
            emailHTML
          );

          res.json({
            message:
              "If an account with this email exists, a password reset link has been sent."
          });

        } catch (error) {
          console.log("Email error:", error);
          return next(error);
        }
      }
    );
  });
};

module.exports = {
    signup, 
    login,
    forgotPassword
};