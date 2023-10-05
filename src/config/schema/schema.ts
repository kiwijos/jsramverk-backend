import { buildSchema } from "graphql";

const schema = buildSchema(`
    type Query {
        tickets(limit: Int): [Ticket]
        ticket(id: ID!): Ticket
    }
    type Mutation {
        createTicket(code: String!, trainnumber: String!, traindate: String!): TicketResponse
        updateTicket(id: ID!, code: String, trainnumber: String, traindate: String): TicketResponse
        deleteTicket(id: ID!): TicketResponse
    }
    type Ticket {
        id: ID!
        code: String!
        trainnumber: String!
        traindate: String!
    }
    type Tickets {
        tickets: [Ticket]
    }
    type TicketResponse {
        data: Ticket
        error: String
        ok: Boolean
    }
`);

export default schema;
