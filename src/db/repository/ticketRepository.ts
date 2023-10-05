import Ticket from "../models/Ticket";
import type ITicket from "../../models/ITicket.model";

const ticketRepository = {
    getAllTickets: async (limit: number) => {
        return await Ticket.find({}).limit(limit);
    },

    getTicketById: async (id: string) => {
        return await Ticket.findById(id);
    },

    createTicket: async ({ code, trainnumber, traindate }: ITicket) => {
        const newTicket = new Ticket({ code, trainnumber, traindate });
        await newTicket.save();

        return newTicket;
    },

    updateTicket: async (id: string, { code, trainnumber, traindate }: ITicket) => {
        const ticket = await Ticket.findById(id);

        if (code) ticket.code = code;
        if (trainnumber) ticket.trainnumber = trainnumber;
        if (traindate) ticket.traindate = traindate;

        await ticket.save();

        return ticket;
    },

    deleteTicket: async (id: string) => {
        return await Ticket.findByIdAndDelete(id);
    }
};

export default ticketRepository;
