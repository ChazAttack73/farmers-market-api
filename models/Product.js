module.exports = function ( sequelize, DataTypes ) {
  var Product = sequelize.define( "Product", {
    name : DataTypes.STRING( 255 ),
    price : DataTypes.STRING( 255 ),
    quantity : DataTypes.INTEGER,
    description : DataTypes.STRING( 255 ),
    product_picture : DataTypes.STRING( 255 ),
  }, {
    classMethods: {
      associate: function ( models ) {
        Product.belongsTo( models.Vendor );
      }
    }
  });

  return Product;
};