import { Collection, MongoClient } from "mongodb";
import database from "../db/database";

interface Ticket {
    code: string;
    trainnumber: string;
    traindate: string;
}

interface DatabaseConnection {
    collection: Collection<Ticket>;
    client: MongoClient;
}

const trains = {
    fetchAllDelayedTrains: async function fetchAllDelayedTrains(): Promise<object> {
        let db: DatabaseConnection | undefined;

        try {
            db = await database.run();
        } catch (error) {
            return {
                status: error.status,
                message: error.message
            };
        } finally {
            await db.client.close();
        }
    }
};

export default trains;
