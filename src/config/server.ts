import app from "./app";

import http from "http";
import { Server } from "socket.io";

const server = http.createServer(app);

interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
    newdata: (data: { id: string; deleted: boolean }) => void;
}

interface ClientToServerEvents {
    noArg: () => void;
    update: (id: string) => void;
    delete: (id: string) => void;
    create: (id: string) => void;
}

interface InterServerEvents {
    ping: () => void;
}

interface SocketData {
    id: string;
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

io.sockets.on("connection", (socket) => {
    // Inform all connected clients that the data has been updated
    socket.on("update", (id: string) => {
        console.log(`Someone updated ${id}`);
        io.emit("newdata", { id, deleted: false });
    });
    // Inform all connected clients that the data has been deleted
    socket.on("delete", (id: string) => {
        console.log(`Someone deleted ${id}`);
        io.emit("newdata", { id, deleted: true });
    });
    // Inform all connected clients that the data has created
    socket.on("create", (id: string) => {
        console.log(`Someone created ${id}`);
        io.emit("newdata", { id, deleted: false });
    });
});

export { server, io };
