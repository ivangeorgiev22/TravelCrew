import { Router } from "express";
import { getTrips, getTrip, postTrip } from "../controllers/tripController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get('/', authMiddleware, getTrips);
router.get('/:id', authMiddleware, getTrip);
router.post('/', authMiddleware, postTrip);

export default router;