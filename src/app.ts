import dotenv from "dotenv";
dotenv.config();

import express, { Express } from "express";
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
        origin: ["http://localhost:9000", "http://localhost:5173", "https://localhost:5000"],
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

import mongoose from 'mongoose';

startDb().catch(err => console.log(err));

async function startDb() {
    let uri = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@trains.9gkcdmg.mongodb.net/?retryWrites=true&w=majority`;

    if (process.env.NODE_ENV === "test") {
        uri = process.env.MONGO_URI_TEST;
    }

  await mongoose.connect(uri);
}

const port = 1337;

app.use("/delayed", delayed);
app.use("/tickets", tickets);
app.use("/codes", codes);

server.listen(port, (): void => {
    console.log(`Example app listening on port ${port}`);
});

// Temporary work-around preventing sockets from keeping
// the server alive even after all tests have run
if (process.env.NODE_ENV !== "test") {
    fetchTrainPositions(io);
}

export default server;
