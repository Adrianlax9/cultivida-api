// src/controllers/contact.controller.js
const { Contact } = require("../models");
// OPCIONAL correo: const nodemailer = require("nodemailer");

exports.create = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ msg: "Faltan campos obligatorios." });
    }

    const c = await Contact.create({ name, email, phone, message });

    // ===== Opcional: enviar correo (configura SMTP en .env) =====
    // if (process.env.SMTP_HOST) {
    //   const transporter = nodemailer.createTransport({
    //     host: process.env.SMTP_HOST,
    //     port: Number(process.env.SMTP_PORT || 587),
    //     secure: false,
    //     auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    //   });
    //   await transporter.sendMail({
    //     from: `"Web Cultivida" <${process.env.SMTP_USER}>`,
    //     to: process.env.NOTIFY_EMAIL, // tu correo
    //     subject: "Nuevo mensaje de contacto",
    //     text: `Nombre: ${name}\nEmail: ${email}\nTel: ${phone || "-"}\n\n${message}`,
    //   });
    // }

    res.status(201).json({ msg: "Mensaje recibido", contact: c });
  } catch (err) {
    console.error("contact.create error:", err);
    res.status(500).json({ msg: "Error guardando el mensaje" });
  }
};

exports.list = async (_req, res) => {
  try {
    const rows = await Contact.findAll({
      order: [["createdAt", "DESC"]],
      limit: 100,
    });
    res.json(rows);
  } catch (err) {
    console.error("contact.list error:", err);
    res.status(500).json({ msg: "Error consultando mensajes" });
  }
};
