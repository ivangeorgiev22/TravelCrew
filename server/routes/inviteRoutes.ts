import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  sendInvite,
  acceptInvitedMember,
} from "../controllers/inviteController";
const router = Router();
//routes were flipped so express was not getting to the accept but rather sending another invite
router.post("/accept", authMiddleware, acceptInvitedMember);
router.post("/:tripId", authMiddleware, sendInvite);

export default router;
