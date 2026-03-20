import { Router } from "express";
import { getTrips, getTrip, postTrip, deleteTrip } from "../controllers/tripController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get('/', authMiddleware, getTrips);
router.get('/:id', authMiddleware, getTrip);
router.post('/', authMiddleware, postTrip);
router.delete('/:id', authMiddleware, deleteTrip);

export default router;