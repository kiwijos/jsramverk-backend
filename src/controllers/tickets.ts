import { Response, Request } from "express";
import Ticket from "../models/ticket";

const tickets = {
    getTickets: async function getTickets(req: Request, res: Response): Promise<object> {
        const allTickets = await Ticket.find({});

        // Rename _id to id
        const renamedTickets = allTickets.map(ticket => {
            const { _id, ...ticketData } = ticket.toJSON();
            return { id: _id, ...ticketData };
        });

        return res.json({
            data: renamedTickets
        });
    },

    createTicket: async function createTicket(req: Request, res: Response): Promise<object> {
        const newTicket = new Ticket(req.body);
        await newTicket.save()

        return res.status(201).json({
            data: {
                id: newTicket._id,
                ...req.body
            }
        });
    }
};

export default tickets;
