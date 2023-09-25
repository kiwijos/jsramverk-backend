import { Schema, model } from 'mongoose';

interface ITicket {
    code: string;
    trainnumber: string;
    traindate: string;
}

const ticketSchema = new Schema<ITicket>({
    code: { type: String, required: true },
    trainnumber: { type: String, required: true },
    traindate: { type: String, required: true }
});

const Ticket = model<ITicket>('Ticket', ticketSchema);

export default Ticket;
