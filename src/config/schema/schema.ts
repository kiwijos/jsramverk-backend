import { buildSchema } from "graphql";

const schema = buildSchema(`
    type Query {
        tickets(limit: Int): [Ticket]
        ticket(id: ID!): Ticket
        trainDelays: TrainDelayResponse
        ticketCodes: TicketCodeResponse
        trainStations: TrainStationResponse
    }
    type Mutation {
        createTicket(code: String!, trainnumber: String!, traindate: String!): TicketResponse
        updateTicket(id: ID!, code: String, trainnumber: String, traindate: String): TicketResponse
        deleteTicket(id: ID!): TicketResponse
    }
    type TrainDelayResponse {
        data: [TrainDelay]
        error: String
        ok: Boolean
    }
    type TicketCodeResponse {
        ok: Boolean
        error: String
        data: [TicketCode]
    }
    type TrainStationResponse {
        ok: Boolean
        error: String
        data: [TrainStation]
    }
    type TicketCode {
        Code: String
        Level1Description: String
        Level2Description: String
        Level3Description: String
    }
    type TrainDelay {
        ActivityId: String!
        ActivityType: String
        AdvertisedTimeAtLocation: String
        AdvertisedTrainIdent: String
        Canceled: Boolean
        EstimatedTimeAtLocation: String
        FromLocation: [TrainLocation]
        LocationSignature: String
        OperationalTrainNumber: String
        ToLocation: [TrainLocation]
        TrainOwner: String
    }
    type TrainStation {
        AdvertisedLocationName: String!
        LocationSignature: String!
        Longitude: String!
        Latitude: String!
    }
    type TrainLocation {
        LocationName: String!
        Order: Int!
        Priority: Int!
    }
    type Ticket {
        id: ID!
        code: String!
        trainnumber: String!
        traindate: String!
    }
    type TicketResponse {
        data: Ticket
        error: String
        ok: Boolean
    }
`);

export default schema;
