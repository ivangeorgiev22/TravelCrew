import { Request, Response } from "express";
import { Trip, Activity } from "../models";

export const getTrips = async (req:Request, res: Response) => {
  try {
    const trips = await Trip.findAll({
      where: {ownerId: req.user!.id}
    });

    res.status(200).json(trips);
  } catch (error) {
    console.error(error);
    res.status(500).json({msg: "Internal Server Error"});
  }
};

export const getTrip = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  try {
    const trip = await Trip.findByPk(id, {
      include: [Activity]
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
    })
    return res.status(201).json(newTrip);
  } catch (error) {
    console.error(error);
    res.status(500).json({msg: "Internal Server Error"});
  };
};