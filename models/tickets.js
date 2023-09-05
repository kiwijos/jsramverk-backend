const database = require('../db/database.js');

const tickets = {
    getTickets: async function getTickets(req, res){
        const db = await database.run().catch(console.dir);

        const options = {
            // Sort matched documents in descending order by id
            sort: { "_id": -1 },
            // Include all fields and rename _id to id
            projection: { id: "$_id", code: 1, trainnumber: 1, traindate: 1},
        };

        const allTickets = await db.collection.find({}, options).toArray();

        await db.client.close();

        return res.json({
            data: allTickets
        });
    },

    createTicket: async function createTicket(req, res){
        const db = await database.run().catch(console.dir);

        const result = await db.collection.insertOne({
            code: req.body.code,
            trainnumber: req.body.trainnumber,
            traindate: req.body.traindate
        });

        await db.client.close();

        return res.json({
            data: {
                id: result.insertedId.toString(),
                code: req.body.code,
                trainnumber: req.body.trainnumber,
                traindate: req.body.traindate,
            }
        });
    }
};

module.exports = tickets;
