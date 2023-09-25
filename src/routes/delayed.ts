import express, { Request, Response, Router } from "express";
const router: Router = express.Router();

import delayed from "../controllers/delayed";

router.get("/", (req: Request, res: Response) => delayed.getDelayedTrains(req, res));

export default router;
