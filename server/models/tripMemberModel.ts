import { Sequelize, DataTypes, Model } from "sequelize";

export default (sequelize: Sequelize) => {
  class TripMember extends Model {
    declare id: number;
    declare role: string;
  }

  TripMember.init(
    {
      id: {
        type: DataTypes.INTEGER,
        defaultValue: DataTypes.INTEGER,
        primaryKey: true,
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
