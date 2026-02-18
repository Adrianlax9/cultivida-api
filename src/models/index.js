// src/models/index.js
const { Sequelize, DataTypes } = require("sequelize");
const config = require("../config/config");

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: false,
  }
);


const db = {};

// Usa los nombres de archivo que tienes en disco:
db.User = require("./user.model")(sequelize, DataTypes);     // ok
db.Product = require("./product.model")(sequelize, DataTypes); // ok
db.Review = require("./review.model")(sequelize, DataTypes);   // ok

// Estos dos están capitalizados en tu carpeta:
db.Order = require("./Order")(sequelize, DataTypes);
db.OrderItem = require("./OrderItem")(sequelize, DataTypes);

// ===== Asociaciones =====
db.User.hasMany(db.Review, { foreignKey: "userId" });
db.Review.belongsTo(db.User, { foreignKey: "userId" });

db.User.hasMany(db.Order, { foreignKey: "userId" });
db.Order.belongsTo(db.User, { as: "user", foreignKey: "userId" });

db.Order.hasMany(db.OrderItem, { as: "items", foreignKey: "orderId" });
db.OrderItem.belongsTo(db.Order, { foreignKey: "orderId" });

db.Product.hasMany(db.OrderItem, { foreignKey: "productId" });
db.OrderItem.belongsTo(db.Product, { foreignKey: "productId" });

db.Contact = require("./contact.model")(sequelize, DataTypes);

// Exporta sequelize
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
