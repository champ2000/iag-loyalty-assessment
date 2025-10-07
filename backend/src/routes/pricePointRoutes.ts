import { Router } from "express";
import { getPricePoints } from "../controllers/pricePointController";

const router = Router();

router.post("/price-points", getPricePoints);

export default router;
