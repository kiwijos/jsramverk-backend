import { Collection, MongoClient } from "mongodb";

interface Ticket {
    code: string;
    trainnumber: string;
    traindate: string;
}

interface DatabaseConnection {
    collection: Collection<Ticket>;
    client: MongoClient;
}

const database = {
    run: async function run(): Promise<DatabaseConnection | undefined> {
        let uri = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@trains.9gkcdmg.mongodb.net/?retryWrites=true&w=majority`;

        if (process.env.NODE_ENV === "test") {
            uri = process.env.MONGO_URI_TEST;
        }

        // Client references the connection to our datastore (Atlas, for example)
        const client = new MongoClient(uri);

        try {
            // Instruct driver to connect using the provided settings
            // when a connection is required
            await client.connect();

            // If the database and/or collection do not exist, the driver and Atlas
            // will create them automatically when data is first written
            const dbName = "trains";
            const collectionName = "tickets";

            // Store references to the database and collection in order to run
            // operations on them later
            const database = client.db(dbName);
            const collection = database.collection<Ticket>(collectionName);

            console.log(`Connected to MongoDB using URI: ${uri}`);

            return {
                collection: collection,
                client: client
            };
        } catch (err) {
            console.error(`Something went wrong when trying to connect: ${err}\n`);
        }
        // Ensure client closes if there is an error to free resources
        // If there is no error, trust caller to close the client
        await client.close();
    }
};

export default database;
