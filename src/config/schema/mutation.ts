import ticketRepository from "../../db/repository/ticketRepository";
import type ITicket from "../../models/ITicket.model";

const mutation = {
    createTicket: async ({ code, trainnumber, traindate }: ITicket) => {
        const ticket = ticketRepository.createTicket({ code, trainnumber, traindate });
        return {
            data: ticket,
            ok: true,
            error: ""
        };
    },

    updateTicket: async ({ id, code, trainnumber, traindate }: ITicket & { id: string }) => {
        try {
            const ticket = await ticketRepository.updateTicket(id, {
                code,
                trainnumber,
                traindate
            });
            if (!ticket) {
                return {
                    data: null,
                    ok: false,
                    error: "Ticket not found"
                };
            }
            return {
                data: ticket,
                ok: true,
                error: ""
            };
        } catch (err) {
            return {
                data: null,
                ok: false,
                error: err.message
            };
        }
    },

    deleteTicket: async ({ id }: { id: string }) => {
        try {
            const ticket = await ticketRepository.deleteTicket(id);
            if (!ticket) {
                return {
                    data: null,
                    ok: false,
                    error: "Ticket not found"
                };
            }
            return {
                data: ticket,
                ok: true,
                error: ""
            };
        } catch (err) {
            return {
                data: null,
                ok: false,
                error: err.message
            };
        }
    }
};

export default mutation;
