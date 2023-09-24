import { Response, Request } from "express";
import Ticket from "../models/ticket";

const tickets = {
    getTickets: async function getTickets(req: Request, res: Response): Promise<object> {
        const allTickets = await Ticket.find({}).sort({_id: -1});

        return res.json({
            data: allTickets
        });
    },

    createTicket: async function createTicket(req: Request, res: Response): Promise<object> {
        const newTicket = new Ticket(req.body);
        await newTicket.save()

        return res.status(201).json({
            data: {
                id: newTicket._id.toString(),
                ...req.body
            }
        });
    }
};

export default tickets;
