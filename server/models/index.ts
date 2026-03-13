import { Sequelize } from "sequelize";
import dotenv from 'dotenv';

import UserModel from './userModel';
import TripModel from './tripModel';
import ActivityModel from './activityModel';

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USERNAME as string,
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST as string,
    dialect: 'postgres',
    port: 5432
  }
);

const User = UserModel(sequelize);
const Trip = TripModel(sequelize);
const Activity = ActivityModel(sequelize);

User.hasMany(Trip, {foreignKey: "ownerId"});
Trip.belongsTo(User, {foreignKey: "ownerId"});

Trip.hasMany(Activity, {foreignKey: "tripId"});
Activity.belongsTo(Trip, {foreignKey: "tripId"});

User.hasMany(Activity, {foreignKey: "createdBy"});
Activity.belongsTo(User, {foreignKey: "createdBy"});

export {User, Trip, Activity};