const { DataTypes, Model } = require("sequelize");

class OperationalSoftwareInstallationRequestEmployee extends Model {}

module.exports = (sequelize) => {
    OperationalSoftwareInstallationRequestEmployee.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      request_id: {
        type: DataTypes.INTEGER,
      },
      employee_id: {
        type: DataTypes.INTEGER,
      },
      step: {
        type: DataTypes.INTEGER
      }
    },
    {
      sequelize,
      modelName: "OperationalSoftwareInstallationRequestEmployee",
      tableName: "operational_software_installation_request_employee",
    }
  );

  return OperationalSoftwareInstallationRequestEmployee;
};
