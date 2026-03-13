import { Router } from "express";
import { getTrips, getTrip } from "../controllers/tripController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get('/', authMiddleware, getTrips);
router.get('/:id', authMiddleware, getTrip);

export default router;