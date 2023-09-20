import { Response, Request } from "express";
import database from "../db/database";
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

const tickets = {
    getTickets: async function getTickets(req: Request, res: Response): Promise<object> {
        const db: DatabaseConnection | undefined = await database.run();

        const allTickets: Ticket[] = await db.collection
            .find(
                {},
                {
                    // Sort matched documents in descending order by id
                    sort: { _id: -1 },
                    // Include all fields and rename _id to id
                    projection: { id: "$_id", code: 1, trainnumber: 1, traindate: 1 }
                }
            )
            .toArray();

        await db.client.close();

        return res.json({
            data: allTickets
        });
    },

    createTicket: async function createTicket(req: Request, res: Response): Promise<object> {
        const db: DatabaseConnection | undefined = await database.run();

        const result = await db.collection.insertOne({
            code: req.body.code,
            trainnumber: req.body.trainnumber,
            traindate: req.body.traindate
        });

        await db.client.close();

        return res.status(201).json({
            data: {
                id: result.insertedId.toString(),
                code: req.body.code,
                trainnumber: req.body.trainnumber,
                traindate: req.body.traindate
            }
        });
    }
};

export default tickets;
