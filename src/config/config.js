require("dotenv").config();

// Configuración para Sequelize en Railway
module.exports = {
  username: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  host: process.env.MYSQLHOST,
  port: process.env.MYSQLPORT,
  dialect: "mysql",
  logging: false,
};

