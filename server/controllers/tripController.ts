import { Request, Response } from "express";
import { Trip, Activity, User, TripMember } from "../models";
import { Op } from "sequelize";

export const getTrips = async (req:Request, res: Response) => {
  try {

    const ownTrips = await Trip.findAll({
      where: {ownerId: req.user!.id}
    });

    const memberTrips = await Trip.findAll({
      include: [
        {
          association: "Users",
          where: {id: req.user!.id},
          attributes: [],
          through: {attributes: []},
        }
      ],
      where: {
        ownerId: {[Op.ne]: req.user!.id} //Op means not equal so this will exclude trips you are not the owner of.
      }
    });

    res.status(200).json({ownTrips, memberTrips});
  } catch (error) {
    console.error(error);
    res.status(500).json({msg: "Internal Server Error"});
  }
};

export const getTrip = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const trip = await Trip.findByPk(id, {
      include: [
        Activity, 
        {
          model: User,
          attributes: ["id", "name", "email"],
          through: {attributes: ["role"]},
          association: "Users"
        }
      ]
    });

    if(!trip) {
      return res.status(404).json({msg: "Trip not found"});
    }

    res.status(200).json(trip);
  } catch (error) {
    console.error(error);
    res.status(500).json({msg: "Internal Server Error"});
  }
};

export const postTrip = async (req: Request, res: Response) => {
  const {destination, startDate, endDate } = req.body;
  if (!destination || !startDate || !endDate) {
    return res.status(400).json({msg: "Missing fields!" });
  }
  try {
    const newTrip = await Trip.create({
      destination,
      startDate,
      endDate,
      ownerId: req.user!.id
    });
    //when user creates a trip he is added to the members as owner
    await TripMember.create({
      userId: req.user!.id,
      tripId: newTrip.id,
      role: "owner"
    });

    return res.status(201).json(newTrip);
  } catch (error) {
    console.error(error);
    res.status(500).json({msg: "Internal Server Error"});
  };
};

export const deleteTrip = async(req: Request, res: Response) => {
  const tripId = req.params.id;
  const userId = req.user!.id;
  try {
    const tripOwner = await TripMember.findOne({
      where: {
        tripId: tripId,
        userId: userId,
        role: "owner"
      }
    });

    if(!tripOwner) {
      return res.status(403).json({msg: "Not authorized"});
    }

    await Trip.destroy({
      where: {id: tripId}
    });
    
    res.status(204).json({msg: "Trip deleted successfully!"});
  } catch (error) {
    console.error(error);
    res.status(500).json({msg: "Internal Server Error"});
  }
}