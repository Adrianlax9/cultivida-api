require("dotenv").config();

// Este objeto lo usa Sequelize para conectarse a MySQL
module.exports = {
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "cultivida",
  host: process.env.DB_HOST || "127.0.0.1",
  dialect: "mysql",
  logging: false,
};
