import express from "express";
import { startSOS } from "../controllers/sosController.js";

const router = express.Router();

router.post("/start", startSOS);

export default router;
