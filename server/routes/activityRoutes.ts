import { Router } from "express";
import { getActivities, postActivity, deleteActivity } from "../controllers/activityController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get('/trip/:tripId', authMiddleware, getActivities);
router.post('/', authMiddleware, postActivity);
router.delete('/:id', authMiddleware, deleteActivity);

export default router