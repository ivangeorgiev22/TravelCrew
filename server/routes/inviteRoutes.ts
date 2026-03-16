import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  sendInvite,
  acceptInvitedMember,
} from "../controllers/inviteController";
const router = Router();

router.post("/:tripId", authMiddleware, sendInvite);
router.post("/accept", authMiddleware, acceptInvitedMember);

export default router;
