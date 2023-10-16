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
        login(username: String!, password: String!): LoginResponse
        register(username: String!, password: String!, email: String!): RegisterResponse
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
    type RegisterResponse {
        data: String
        error: String
        ok: Boolean
    }
    type User {
        username: String!
        email: String!
    }
    type LoginResponse {
        data: LoginData
        error: String
        ok: Boolean
    }
    type LoginData {
        type: String
        message: String
        user: User
        token: String
    }
`);

export default schema;
