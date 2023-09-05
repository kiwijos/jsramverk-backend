const { MongoClient } = require('mongodb');

const database = {
    run: async function run () {
        let uri = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@trains.9gkcdmg.mongodb.net/?retryWrites=true&w=majority`;

        if (process.env.NODE_ENV === 'test') {
            uri = ""; // TODO: setup test database
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
            const collection = database.collection(collectionName);

            return {
                collection: collection,
                client: client,
            };
        } catch (err) {
            console.error(`Something went wrong when trying to connect: ${err}\n`);
        } 
        await client.close(); // Ensure client closes if there is an error
    }
}

module.exports = database;
