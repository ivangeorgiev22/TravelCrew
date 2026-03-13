import { Request, Response } from "express"
import { Trip } from "../models"


export const postTrip = async (req: Request, res: Response) => {
  const {destination, startDate, endDate, ownerId } = req.body;
  if (!destination || !startDate || !endDate || !ownerId) {
    return res.status(400).json({msg: "Missing fields!" });
  }
  try {
    const newTrip = await Trip.create({
      destination,
      startDate,
      endDate,
      ownerId
    })
    return res.status(201).json(newTrip);
  } catch (error) {
    console.error(error);
    res.status(500).json({msg: "Internal Server Error"});
  };
};