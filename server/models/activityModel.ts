import { Sequelize, DataTypes, Model } from "sequelize";

export default (sequelize: Sequelize) => {

  class Activity extends Model {
    declare id: number;
    declare name: string;
    declare location: string;
    declare date: Date;
    declare time: string;
  };

  Activity.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      time: {
        type: DataTypes.STRING
      }
    },
    {
      sequelize,
      modelName: "Activity"
    }
  );
  return Activity;
};