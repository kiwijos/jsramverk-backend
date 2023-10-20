import { buildSchema } from "graphql";

const schema = buildSchema(`
    type Query {
        nothing: String
    }
    type Mutation {
        login(username: String!, password: String!): LoginResponse
        register(username: String!, password: String!, email: String!): RegisterResponse
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
