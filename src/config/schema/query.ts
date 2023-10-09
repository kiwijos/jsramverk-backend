import ticketRepository from "../../db/repository/ticketRepository";

const query = {
    tickets: async ({ limit }: { limit: number }) => {
        return await ticketRepository.getAllTickets(limit);
    },
    ticket: async ({ id }: { id: string }) => {
        return await ticketRepository.getTicketById(id);
    }
};

export default query;
