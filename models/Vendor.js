module.exports = function ( sequelize, DataTypes ) {
  var Vendor = sequelize.define( "Vendor", {
    name : DataTypes.STRING( 255 ),
    password : DataTypes.STRING( 255 ),
    phone : DataTypes.STRING( 20 ),
    email : DataTypes.STRING( 255 ),
    website : DataTypes.STRING( 255 ),
    description : DataTypes.STRING( 500 ),
    company_pic : DataTypes.STRING( 255 )
  }, {
    classMethods: {
      associate: function ( models ) {
        Vendor.hasMany( models.Product );
        Vendor.belongsTo( models.Event );
      }
    }
  });
  return Vendor;
};