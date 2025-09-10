const bcrypt = require("bcryptjs");
const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

// SIGNUP
exports.signup = (req, res) => {
  const { email, password, full_name, role } = req.body;

  db.query("SELECT id FROM users WHERE email=?", [email], async (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (email, password_hash, full_name, role) VALUES (?, ?, ?, ?)",
      [email, hashed, full_name || null, role || "student"],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({
          message: "User signed up!",
          email,
          full_name,
          role: role || "student"
        });
      }
    );
  });
};

// LOGIN
exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email=?", [email], async (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!rows.length) return res.status(401).json({ error: "Invalid credentials" });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const jti = uuidv4();
    const token = jwt.sign(
      { sub: user.id, email: user.email, jti, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const expDate = new Date(Date.now() + 60 * 60 * 1000);

    res.json({
      message: "User logged in!",
      token,
      expires_at: expDate,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      }
    });
  });
};

// LOGOUT
exports.logout = (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(400).json({ error: "No token provided" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const expDate = new Date(payload.exp * 1000);

    db.query(
      "INSERT INTO revoked_tokens (jti, expires_at) VALUES (?, ?)",
      [payload.jti, expDate],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "User logged out!" });
      }
    );
  } catch {
    return res.status(401).json({ error: "invalid or expired token" });
  }
};

// PROFILE
exports.profile = (req, res) => {
  db.query(
    "SELECT id, email, full_name, role, created_at FROM users WHERE id=?",
    [req.user.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!rows.length) return res.status(404).json({ error: "User not found" });
      res.json({ message: "User profile data", user: rows[0] });
    }
  );
};
