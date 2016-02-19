module.exports = function ( sequelize, DataTypes ) {
  var Event = sequelize.define( "Event", {
    name : DataTypes.STRING( 255 ),
    address : DataTypes.STRING( 255 ),
    days : DataTypes.STRING( 100 ),
    time : DataTypes.STRING( 100 )
  }, {
    classMethods: {
      associate: function ( models ) {
        Event.hasMany( models.Vendor );
      }
    }
  });

  return Event;
};