const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

module.exports = (sequelize) => {
  const User = sequelize.define("User", {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM("customer", "admin"), defaultValue: "customer" }
  }, { tableName: "users" });

  User.beforeCreate(async (u) => {
    u.password = await bcrypt.hash(u.password, 10);
  });

  User.prototype.comparePassword = function (plain) {
    return bcrypt.compare(plain, this.password);
  };

  return User;
};
