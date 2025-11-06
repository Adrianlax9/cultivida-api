// src/models/contact.model.js
module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define(
    "Contact",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING(120), allowNull: false },
      email: { type: DataTypes.STRING(160), allowNull: false },
      phone: { type: DataTypes.STRING(40) },
      message: { type: DataTypes.TEXT, allowNull: false },
    },
    {
      tableName: "contacts",
      timestamps: true,
      underscored: false,
    }
  );
  return Contact;
};
