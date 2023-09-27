import app from "./app";

import http from "http";
import { Server } from "socket.io";

const server = http.createServer(app);

interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
    hello: () => void;
}

interface InterServerEvents {
    ping: () => void;
}

interface SocketData {
    name: string;
    age: number;
}

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(
    server,
    {
        cors: {
            origin: [
                "http://localhost:9000",
                "http://localhost:5173",
                "https://localhost:5000",
                "https://master--fastidious-sunburst-6bd3ae.netlify.app"
            ],
            methods: ["GET", "POST", "PUT", "DELETE"]
        }
    }
);

export { server, io };
