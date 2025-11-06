module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "Order",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

      userId: { type: DataTypes.INTEGER, allowNull: false },

      status: {
        type: DataTypes.ENUM("pending", "paid", "shipped", "cancelled"),
        defaultValue: "pending",
      },

      // datos de entrega
      address: { type: DataTypes.STRING, allowNull: false },
      city: { type: DataTypes.STRING, allowNull: false },
      phone: { type: DataTypes.STRING, allowNull: false },
      notes: { type: DataTypes.TEXT },

      // totales
      subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      shippingCost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      tableName: "orders",
      timestamps: true,
    }
  );

  Order.associate = (models) => {
    // cada orden pertenece a un usuario
    Order.belongsTo(models.User, { foreignKey: "userId", as: "user" });

    // y tiene muchos items
    Order.hasMany(models.OrderItem, {
      foreignKey: "orderId",
      as: "items",
      onDelete: "CASCADE",
    });
  };

  return Order;
};
