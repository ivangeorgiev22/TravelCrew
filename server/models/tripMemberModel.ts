import { Sequelize, DataTypes, Model } from "sequelize";

export default (sequelize: Sequelize) => {
  class TripMember extends Model {
    declare id: number;
    declare role: string;
    declare tripId: string;
    declare userId: string;
  }

  TripMember.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tripId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      role: {
        type: DataTypes.STRING,
        defaultValue: "member",
      },
    },
    {
      sequelize,
      modelName: "TripMember",
    },
  );
  return TripMember;
};
