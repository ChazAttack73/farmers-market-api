module.exports = function ( sequelize, DataTypes ) {
  var Product = sequelize.define( "Product", {
    name : {
      type: DataTypes.STRING( 255 ),
      allowNull: false
    },
    price : {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    quantity : DataTypes.INTEGER,
    description : DataTypes.STRING( 255 ),
    product_picture : DataTypes.STRING( 255 )
  }, {
    classMethods: {
      associate: function ( models ) {
        Product.belongsTo( models.Vendor );
      }
    }
  });
  return Product;
};