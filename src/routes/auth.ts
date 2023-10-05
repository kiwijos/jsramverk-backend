import express, { Request, Response, Router } from "express";
const router: Router = express.Router();

import auth from "../controllers/auth";

router.post("/login", (req: Request, res: Response) => auth.login(req, res));
router.post("/register", (req: Request, res: Response) => auth.register(req, res));

export default router;
