import express, { Express } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { graphqlHTTP } from "express-graphql";
import { schema, resolver } from "./schema/index";

import delayed from "../routes/delayed";
import tickets from "../routes/tickets";
import codes from "../routes/codes";

const app: Express = express();

app.use(cors());
app.options("*", cors());

app.disable("x-powered-by");

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Make handler a graphql handler
app.use(
    "/graphql",
    graphqlHTTP({
        schema,
        rootValue: resolver,
        graphiql: true
    })
);

app.use("/delayed", delayed);
app.use("/tickets", tickets);
app.use("/codes", codes);

export default app;
