const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const { sequelize } = require("./models");
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const reviewRoutes = require("./routes/review.routes");
const contactRoutes = require("./routes/contact.routes");

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use("/api/contact", contactRoutes);


app.get("/", (_, res) => res.json({ ok: true, name: "cultivida-api" }));
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);

const PORT = process.env.PORT || 5000;
sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => console.log(`API lista en http://localhost:${PORT}`));
});
