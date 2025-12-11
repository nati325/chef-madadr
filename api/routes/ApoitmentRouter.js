import express from "express";
import { createAppoitment, deleteAppoitment, getAppoitment, getOccupiedDates } from "../controllers/AppoitmentController.js";

const router = express.Router();

router.post("/create", createAppoitment);
router.get("/occupied", getOccupiedDates);
router.delete("/delete/:id", deleteAppoitment);
router.delete("/delete/:id", deleteAppoitment);
router.get("/get", getAppoitment);

export default router;