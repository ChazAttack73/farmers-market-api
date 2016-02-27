module.exports = function(sequelize, DataTypes) {
  var StripeVendor = sequelize.define("StripeVendor", {
    access_token: {
      type: DataTypes.STRING,
      allowNull: false
    },
    livemode: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    refresh_token: {
      type: DataTypes.STRING,
      allowNull: false
      //unique:true
    },
    token_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    stripe_publishable_key: {
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
  }, {
    classMethods: {
      associate: function( models){
        StripeVendor.belongsTo( models.Vendor, {foreignKey: 'VendorId'});
      }
    }
  });

  return StripeVendor;
};