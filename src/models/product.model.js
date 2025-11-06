// src/models/product.model.js
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(100), allowNull: false },
      slug: { type: DataTypes.STRING(120), unique: true },
      description: { type: DataTypes.TEXT },
      price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      stock: { type: DataTypes.INTEGER, defaultValue: 0 },
      imageUrl: { type: DataTypes.STRING(255) },
      active: { type: DataTypes.BOOLEAN, defaultValue: true },
      infoShort: { type: DataTypes.STRING(500), allowNull: true },
      infoBullets: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      tableName: "products",
      timestamps: true,
    }
  );

  return Product;
};
