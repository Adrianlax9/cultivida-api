const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Product = sequelize.define("Product", {
    name: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: DataTypes.TEXT,
    price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 },
    imageUrl: DataTypes.STRING,
    active: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, { tableName: "products" });

  return Product;
};
