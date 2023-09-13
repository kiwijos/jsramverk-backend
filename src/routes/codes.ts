import express, { Request, Response, Router } from "express";
const router: Router = express.Router();

import codes from "../models/codes";

router.get("/", (req: Request, res: Response) => codes.getCodes(req, res));

export default router;
