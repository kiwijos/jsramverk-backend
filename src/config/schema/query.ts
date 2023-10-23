import ticketRepository from "../../db/repository/ticketRepository";
import trainRepository from "../../db/repository/trainRepository";

const query = {
    tickets: async ({ limit }: { limit: number }) => {
        return await ticketRepository.getAllTickets(limit);
    },
    ticket: async ({ id }: { id: string }) => {
        return await ticketRepository.getTicketById(id);
    },
    trainDelays: async () => {
        return await trainRepository.getTrainDelays();
    },
    ticketCodes: async () => {
        return await trainRepository.getTrainCodes();
    },
    trainStations: async () => {
        return await trainRepository.getTrainStations();
    }
};

export default query;
