module.exports = function(sequelize, DataTypes) {
  var StripeVendor = sequelize.define("StripeVendor", {
    access_token: {
      type: DataTypes.STRING,
      allowNull: false
    },
    token_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    stripe_user_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    scope: {
      type: DataTypes.STRING,
      allowNull: false
    },
  },
  {
    classMethods: {
      associate: function( models){
        StripeVendor.belongsTo( models.Vendor, {foreignKey: 'VendorId'});
      }
    }
  });

  return StripeVendor;
};