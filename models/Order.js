module.exports = function(sequelize, DataTypes) {
  var Order = sequelize.define("Order", {
    productQuantity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    totalCost: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function( models) {
        Order.belongsTo(models.User, {foreignKey:'UserId'});
        Order.belongsTo(models.Product,{foreignKey:'ProductId'});
        Order.hasMany(models.Payment,{foreignKey:'OrderId'});

      }
    }
  });

  return Order;
};