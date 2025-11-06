module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define(
    "OrderItem",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

      orderId: { type: DataTypes.INTEGER, allowNull: false },
      productId: { type: DataTypes.INTEGER, allowNull: false },

      // copiamos datos del producto en el momento de la compra,
      // por si más tarde cambias el precio o el nombre
      name: { type: DataTypes.STRING, allowNull: false },
      price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
      imageUrl: { type: DataTypes.STRING },
    },
    {
      tableName: "order_items",
      timestamps: true,
    }
  );

  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Order, {
      foreignKey: "orderId",
      as: "order",
    });
    OrderItem.belongsTo(models.Product, {
      foreignKey: "productId",
      as: "product",
    });
  };

  return OrderItem;
};
