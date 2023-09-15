import dotenv from "dotenv";
dotenv.config();

import express, { Express, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";

import fetchTrainPositions from "./models/trains";
import delayed from "./routes/delayed";
import tickets from "./routes/tickets";
import codes from "./routes/codes";

const app: Express = express();

import http from "http";

const server = http.createServer(app);

app.use(cors());
app.options("*", cors());

app.disable("x-powered-by");

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

import { Server } from "socket.io";

const io = new Server(server, {
    cors: {
        origin: "http://localhost:9000",
        methods: ["GET", "POST"]
    }
});

const port = 1337;

app.get("/", (req: Request, res: Response): void => {
    res.json({
        data: "Hello World!"
    });
});

app.use("/delayed", delayed);
app.use("/tickets", tickets);
app.use("/codes", codes);

server.listen(port, (): void => {
    console.log(`Example app listening on port ${port}`);
});

// Temporary work-around preventing sockets from keeping
// the server alive even after all tests have run
if (process.env.NODE_ENV !== 'test') {
    fetchTrainPositions(io);
}

export default server;
