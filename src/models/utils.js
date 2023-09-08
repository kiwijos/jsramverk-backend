const database = require('../db/database.js');

const trains = {
    fetchAllDelayedTrains: async function fetchAllDelayedTrains() {
        let db;

        try {
            db = await database.run().catch(console.dir);

        } catch(error) {
            return {
                status: error.status,
                message: error.message,
            };
        } finally {
            await db.client.close();
        }
    }
};

module.exports = trains;
