import dotenv from "dotenv";
dotenv.config();

import { server, io } from "./config/server";
import fetchTrainPositions from "./controllers/trains";
import startDb from "./config/database";

const port = process.env.PORT || 1337;

server.listen(port, (): void => {
    console.log(`App listening on port ${port}`);
});

startDb().catch((err) => console.log(err));

// Temporary work-around preventing sockets from keeping
// the server alive even after all tests have run
if (process.env.NODE_ENV !== "test") {
    fetchTrainPositions(io);
}

// Export listening app for testing
export default server;
