/* global it describe */

process.env.NODE_ENV = "test";

import chai from "chai";
import chaiHttp from "chai-http";
import server from "../src/app";
import database from "../src/db/database";

chai.should();
chai.use(chaiHttp);

describe("tickets", () => {
    describe("GET /tickets", () => {
        it("request results in a 200 status code", (done) => {
            chai.request(server)
                .get("/tickets")
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it("response contains correct json data", (done) => {
            chai.request(server)
                .get("/tickets")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a("object");
                    res.body.should.have.property("data");
                    res.body.data.should.be.an("array");

                    done();
                });
        });
    });

    describe("POST /tickets", () => {
        const requestBody = {
            code: "ABC123",
            trainnumber: "12345",
            traindate: "2023-09-20"
        };

        // Reset the "tickets" collection before each test
        beforeEach(async () => {
            const db = await database.run();

            try {
                await db.collection.drop();
            } catch (err) {
                console.error(err);
            } finally {
                await db.client.close();
            }
        });

        it("request results in a 201 status code", (done) => {
            chai.request(server)
                .post("/tickets")
                .send(requestBody)
                .end((err, res) => {
                    res.should.have.status(201);
                    done();
                });
        });

        it("response contains correct json data", (done) => {
            chai.request(server)
                .post("/tickets")
                .send(requestBody)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.should.be.json;
                    res.body.should.be.a("object");
                    res.body.should.have.property("data");
                    res.body.data.should.have.property("id");
                    res.body.data.should.have.property("code").equal(requestBody.code);
                    res.body.data.should.have
                        .property("trainnumber")
                        .equal(requestBody.trainnumber);
                    res.body.data.should.have.property("traindate").equal(requestBody.traindate);

                    done();
                });
        });
    });
});
