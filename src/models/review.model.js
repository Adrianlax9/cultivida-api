// src/models/review.model.js
module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define(
    "Review",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      name: { type: DataTypes.STRING(120), allowNull: false }, // nombre visible
      city: { type: DataTypes.STRING(120), allowNull: true },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 },
        defaultValue: 5
      },
      message: { type: DataTypes.TEXT, allowNull: false },
      approved: { type: DataTypes.BOOLEAN, defaultValue: true } // si quieres moderar, pon default false
    },
    { tableName: "reviews", underscored: false }
  );
  return Review;
};
