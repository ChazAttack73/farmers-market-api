module.exports = function(sequelize, DataTypes) {
  var Company = sequelize.define("Company", {
    name: DataTypes.STRING
  });

  return Company;
};