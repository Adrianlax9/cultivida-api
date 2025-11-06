// src/controllers/auth.controller.js
const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// POST /api/auth/register
async function register(req, res) {
  try {
    const { name, email, password, role = "user" } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Nombre, email y password son obligatorios" });
    }

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ msg: "Email ya registrado" });

    const hash = await bcrypt.hash(password, 10);
    const u = await User.create({ name, email, passwordHash: hash, role });

    return res.status(201).json({ id: u.id, name: u.name, email: u.email, role: u.role });
  } catch (e) {
    console.error("ERROR /api/auth/register:", e);
    return res.status(500).json({ msg: "Error interno en registro" });
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    const { email = "", password = "" } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ msg: "Email y contraseña son obligatorios" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ msg: "Credenciales inválidas" });

    // soporta passwordHash o (temporalmente) password
    const savedHash = user.passwordHash || user.password;
    if (!savedHash) return res.status(500).json({ msg: "Usuario sin hash de contraseña" });

    const ok = await bcrypt.compare(password, savedHash);
    if (!ok) return res.status(401).json({ msg: "Credenciales inválidas" });

    const payload = { id: user.id, role: user.role || "user" };
    const token = jwt.sign(payload, process.env.JWT_SECRET || "devsecret", { expiresIn: "7d" });

    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (e) {
    console.error("ERROR /api/auth/login:", e);
    return res.status(500).json({ msg: "Error interno en login" });
  }
}

// GET /api/auth/me (opcional)
async function me(req, res) {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ msg: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "devsecret");
    const user = await User.findByPk(decoded.id, {
      attributes: ["id", "name", "email", "role"]
    });
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

    return res.json(user);
  } catch (e) {
    console.error("ERROR /api/auth/me:", e);
    return res.status(401).json({ msg: "Token inválido" });
  }
}

module.exports = { register, login, me };
