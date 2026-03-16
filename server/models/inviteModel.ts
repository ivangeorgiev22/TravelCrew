import { Sequelize, DataTypes, Model, UUIDV4 } from "sequelize";

export default (sequelize: Sequelize) => {
  class Invite extends Model {
    declare email: string;
    declare token: string;
    declare accepted: boolean;
    declare tripId: number;
    // declare createdBy: number;
    declare expiryDate: Date;
  }

  Invite.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      token: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        unique: true,
      },
      accepted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      tripId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // createdBy: {
      //   type: DataTypes.INTEGER,
      // },
      expiryDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Invite",
    },
  );
  return Invite;
};
