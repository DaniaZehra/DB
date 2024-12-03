import express from "express";
import { getWeatherAlerts } from "../controllers/NotificationController.js";

const router = express.Router();

router.get("/", getWeatherAlerts);

export default router;
