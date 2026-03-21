import { Sequelize, DataTypes, Model } from "sequelize";

export default (sequelize: Sequelize) => {
  class Trip extends Model {
    declare id: number;
    declare destination: string;
    declare startDate: Date;
    declare endDate: Date;
    declare ownerId: number;
  }

  Trip.init(
    {
      destination: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      ownerId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "Trip",
    },
  );
  return Trip;
};
