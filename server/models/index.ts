import { Sequelize } from "sequelize";
import dotenv from "dotenv";

import UserModel from "./userModel";
import TripModel from "./tripModel";
import ActivityModel from "./activityModel";
import InviteModel from "./inviteModel";
import TripMemberModel from "./tripMemberModel";

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USERNAME as string,
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST as string,
    dialect: "postgres",
    port: Number(process.env?.DB_PORT),
    dialectOptions: {
      ssl:  process.env.NODE_ENV === "production" ? { require: true, rejectUnauthorized: false } : false,
    }
  },
);

const User = UserModel(sequelize);
const Trip = TripModel(sequelize);
const Activity = ActivityModel(sequelize);
const Invite = InviteModel(sequelize);
const TripMember = TripMemberModel(sequelize);

User.hasMany(Trip, { foreignKey: "ownerId", onDelete: "CASCADE" });
Trip.belongsTo(User, { foreignKey: "ownerId" });

Trip.hasMany(Activity, { foreignKey: "tripId", onDelete: "CASCADE" });
Activity.belongsTo(Trip, { foreignKey: "tripId", onDelete: "CASCADE" });

User.hasMany(Activity, { foreignKey: "createdBy", onDelete: "CASCADE" });
Activity.belongsTo(User, { foreignKey: "createdBy" });

Invite.belongsTo(Trip, { foreignKey: "tripId", onDelete: "CASCADE" });
Trip.hasMany(Invite, { foreignKey: "tripId" });

User.belongsToMany(Trip, { through: TripMember, foreignKey: "userId", onDelete: "CASCADE" });
Trip.belongsToMany(User, { through: TripMember, foreignKey: "tripId", onDelete: "CASCADE" });

export { User, Trip, Activity, Invite, TripMember };
