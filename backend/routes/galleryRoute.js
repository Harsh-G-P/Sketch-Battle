// routes/galleryRoutes.js
import express from "express";
import { getCompletedBattles } from "../controllers/galleryController.js";

const galleryRoute = express.Router();

galleryRoute.get("/", getCompletedBattles);

export default galleryRoute;
