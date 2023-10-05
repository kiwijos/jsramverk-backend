import express, { Express } from "express";
import cors from "cors";
import bodyParser from "body-parser";

import delayed from "../routes/delayed";
import tickets from "../routes/tickets";
import codes from "../routes/codes";
import auth from "../routes/auth";
import jwtAuth from "../middleware/jwtAuth";

const app: Express = express();

app.use(cors());
app.options("*", cors());

app.disable("x-powered-by");

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use("/delayed", jwtAuth.checkToken, delayed);
app.use("/tickets", jwtAuth.checkToken, tickets);
app.use("/codes", jwtAuth.checkToken, codes);
app.use("/auth", auth);

export default app;
