// src/models/user.model.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(120), allowNull: false },
      email: {
        type: DataTypes.STRING(160),
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
      },
      passwordHash: { type: DataTypes.STRING(200), allowNull: false },
      role: {
        type: DataTypes.ENUM("user", "admin"),
        allowNull: false,
        defaultValue: "user"
      },
      active: { type: DataTypes.BOOLEAN, defaultValue: true }
    },
    {
      tableName: "users",
      timestamps: true
    }
  );
  return User;
};
