import {Request, Response} from 'express';
import { Activity } from '../models';


export const getActivities = async (req: Request, res: Response) => {
  try {
    const activities = await Activity.findAll({
      where: {tripId: req.params.tripId},
      order: [
        ["date", "ASC"],
        ["time", "ASC"]
      ]
    })

    res.status(200).json(activities);
  } catch (error) {
    console.error(error);
    res.status(500).json({msg: "Internal Server Error"});
  }
};

export const postActivity = async (req: Request, res: Response) => {
  try {
    const {name, location, date, time, tripId} = req.body;
    if(!name || !location || !date || !time) {
      return res.status(400).json({msg: "Missing fields"});
    }

    const activity = await Activity.create({
      name,
      location,
      date,
      time,
      tripId,
      createdBy: req.user?.id
    })

    res.status(201).json(activity)
  } catch (error) {
    console.error(error);
    res.status(500).json({msg: "Internal Server Error"});
  }
};

export const deleteActivity = async (req: Request, res: Response) => {
  try {
    await Activity.destroy({
      where: {id: req.params.id}
    });

    res.status(200).json({msg: "Activity deleted"});
  } catch (error) {
    console.error(error);
    res.status(500).json({msg: "Internal Server Error"});
  }
}