const database = require('../db/database.js');

const tickets = {
    getTickets: async function getTickets(req, res){
        var db = await database.run();

        var allTickets = await db.collection.find({}).toArray();

        await db.client.close();

        return res.json({
            data: allTickets
        });
    },

    createTicket: async function createTicket(req, res){
        var db = await database.run();

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
