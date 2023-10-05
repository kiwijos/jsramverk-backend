import express, { Request, Response, Router } from "express";
const router: Router = express.Router();

import tickets from "../controllers/tickets";

router.get("/", (req: Request, res: Response) => tickets.getTickets(req, res));

router.post("/", (req: Request, res: Response) => tickets.createTicket(req, res));

router.put("/", (req: Request, res: Response) => tickets.updateTicket(req, res));

export default router;
