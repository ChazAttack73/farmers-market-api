module.exports = function ( sequelize, DataTypes ) {
  var Event = sequelize.define( "Event", {
    name : {
      type: DataTypes.STRING( 255 ),
      allowNull: false,
      unique: true
    },
    address : {
      type: DataTypes.STRING( 255 ),
      allowNull: false
    },
    days : {
      type: DataTypes.STRING( 100 ),
      allowNull: false
    },
    time : {
      type: DataTypes.STRING( 100 ),
      allowNull: false
    },
    event_picture: {
      type: DataTypes.STRING( 100 ),
      allowNull: false
    }
  },
  {
    classMethods: {
      associate: function ( models ) {
        Event.hasMany( models.Vendor, {foreignKey: 'EventId'} );
      }
    }
  });

  return Event;
};