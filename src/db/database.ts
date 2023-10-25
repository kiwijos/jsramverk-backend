import mongoose from "mongoose";

async function startDb() {
    let uri = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@trains.9gkcdmg.mongodb.net/?retryWrites=true&w=majority`;

    if (process.env.NODE_ENV === "test") {
        uri = process.env.MONGO_URI_TEST;
    }

    await mongoose.connect(uri, { dbName: process.env.DATABASE_NAME ?? "trains" });
}

export default startDb;
