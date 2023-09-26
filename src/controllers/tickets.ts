import { Response, Request } from "express";
import Ticket from "../models/Ticket";
import type ErrorResponse from "../models/ErrorResponse.model";

const tickets = {
    getTickets: async function getTickets(req: Request, res: Response): Promise<object | ErrorResponse> {
        try {
            const allTickets = await Ticket.aggregate([
                { $sort: { _id: -1 } },
                { $project: { id: "$_id", code: 1, trainnumber: 1, traindate: 1, _id: 0 } }
            ]);
    
            return res.json({
                data: allTickets
            });
        } catch (err) {
            res.status(500).json({
                errors: {
                    status: 500,
                    source: "/tickets",
                    title: 'Database Error',
                    message: err.message
                }
            });
        }
    },

    createTicket: async function createTicket(req: Request, res: Response): Promise<object | ErrorResponse> {
        const newTicket = new Ticket(req.body);
        
        try { 
            await newTicket.save()

            return res.status(201).json({
                data: {
                    id: newTicket._id,
                    ...req.body
                }
            });
        } catch (err) {
            res.status(500).json({
                errors: {
                    status: 500,
                    source: "/tickets",
                    title: 'Database Error',
                    message: err.message
                }
            });
        }   
    }
};

export default tickets;
