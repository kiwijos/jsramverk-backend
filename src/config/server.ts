import app from "./app";

import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

const server = http.createServer(app);

interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
    newdata: (data: { id: string; deleted: boolean }) => void;
    ticketLockedByOther: (id: string) => void;
    ticketLockedByMe: (id: string) => void;
}

interface ClientToServerEvents {
    noArg: () => void;
    update: (id: string) => void;
    delete: (id: string) => void;
    create: (id: string) => void;
    lockTicket: (id: string) => void;
    unlockTicket: (id: string) => void;
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

io.use((socket, next) => {
    // Check if the token sent from the client is valid
    const token = socket.handshake.auth.token;
    jwt.verify(token, process.env.JWT_SECRET, function (err) {
        if (err) {
            console.error(`Someone attempted to connect but got error ${err.name}: ${err.message}`);
            next(err); // The client will receive a connect_error event
        } else {
            console.log("Socket authenticated");
            next(); // Proceed with the connection
        }
    });
});

io.sockets.on("connection", (socket) => {
    // Attempt to lock a ticket
    socket.on("lockTicket", (id: string) => {
        if (!id) {
            console.log("Someone tried to lock a ticket but didn't provide an id");
            return;
        }
        // Make socket leave all other rooms
        // (except their "own" room and the one with the id of the ticket)
        for (const room of socket.rooms) {
            if (room !== socket.id && room !== id) {
                socket.leave(room);
                console.log(`Someone unlocked ${room} because they attempted to lock ${id}`);
            }
        }

        // check if a room with this id exists (or importantly if it has any clients)
        const clients = io.of("/").adapter.rooms.get(id);

        if (clients && clients?.size > 0) {
            if (clients.has(socket.id)) {
                console.log(`Someone tried to lock ticket ${id} but already has it`);
            } else {
                console.log(
                    `Someone tried to lock ticket ${id} but it is already locked by someone else`
                );
                socket.emit("ticketLockedByOther", id);
            }
        } else {
            socket.join(id);
            console.log(`Someone locked ${id}`);
            socket.emit("ticketLockedByMe", id);
        }
    });

    socket.on("unlockTicket", (id: string) => {
        if (!id) {
            console.log("Someone tried to unlock a ticket but didn't provide an id");
            return;
        }
        // Check if socket is in the room
        if (socket.rooms.has(id)) {
            console.log(`Someone unlocked ${id}`);
            socket.leave(id);
        }
    });

    socket.on("disconnecting", () => {
        // log the rooms the socket is in
        for (const room of socket.rooms) {
            // check if the room is the socket id itself
            if (room !== socket.id) {
                console.log(`Someone disconnected from ${room}. It is now unlocked.`);
            }
        }
    });

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

    // Inform all connected clients that the data has been created
    socket.on("create", (id: string) => {
        console.log(`Someone created ${id}`);
        io.emit("newdata", { id, deleted: false });
    });
});

export { server, io };
