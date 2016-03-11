//Did not do any work on this model
module.exports = function(sequelize, DataTypes) {
  var Payment = sequelize.define("Payment", {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  },
  {
    classMethods: {
      associate: function( models){
        Payment.belongsTo( models.Order, {foreignKey: 'OrderId'});
      }
    }
  });

  return Payment;
};