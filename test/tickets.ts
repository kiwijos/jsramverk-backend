/* global it describe */

process.env.NODE_ENV = "test";

import chai from "chai";
import chaiHttp from "chai-http";
import mongoose from "mongoose";
import server from "../src/index";

import Ticket from "../src/db/models/Ticket";

chai.should();
chai.use(chaiHttp);

const exampleTicket = {
    code: "ABC123",
    trainnumber: "12345",
    traindate: "2023-09-20"
};

// Simply another example to update to when testing put requests
const updatedTicket = {
    code: "123ABC",
    trainnumber: "54321",
    traindate: "2023-10-04"
};

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
        beforeEach(async () => {
            await Ticket.deleteMany();
        });
        it("request results in a 201 status code", (done) => {
            chai.request(server)
                .post("/tickets")
                .send(exampleTicket)
                .end((err, res) => {
                    res.should.have.status(201);
                    done();
                });
        });

        it("response contains correct json data", (done) => {
            chai.request(server)
                .post("/tickets")
                .send(exampleTicket)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.should.be.json;
                    res.body.should.be.a("object");
                    res.body.should.have.property("data");
                    res.body.data.should.have.property("id");
                    res.body.data.should.have.property("code").equal(exampleTicket.code);
                    res.body.data.should.have
                        .property("trainnumber")
                        .equal(exampleTicket.trainnumber);
                    res.body.data.should.have.property("traindate").equal(exampleTicket.traindate);

                    done();
                });
        });
    });

    describe("POST /tickets bad request", () => {
        it("empty request result in 500 status code", (done) => {
            chai.request(server)
                .post("/tickets")
                .send({})
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
        });

        it("response contains correct json data", (done) => {
            chai.request(server)
                .post("/tickets")
                .send({})
                .end((err, res) => {
                    res.should.have.status(500);
                    res.should.be.json;
                    res.body.should.be.a("object");
                    res.body.should.have.property("errors");
                    res.body.errors.should.have.property("status").equal(500);
                    res.body.errors.should.have.property("title").equal("Database Error");
                    res.body.errors.should.have
                        .property("detail")
                        .include("Ticket validation failed");
                    done();
                });
        });
    });

    describe("PUT /tickets", () => {
        let exampleId: mongoose.Types.ObjectId;

        beforeEach(async () => {
            await Ticket.deleteMany(); // Drop exisiting tickets

            const newTicket = new Ticket(exampleTicket);

            await newTicket.save();

            exampleId = newTicket._id;
        });

        it("request results in a 204 status code", (done) => {
            chai.request(server)
                .put("/tickets")
                .send({
                    id: exampleId,
                    ...exampleTicket
                })
                .end((err, res) => {
                    res.should.have.status(204);
                    done();
                });
        });

        it("fields have been updated correctly", (done) => {
            chai.request(server)
                .put("/tickets")
                .send({
                    id: exampleId,
                    ...updatedTicket
                })
                .end(async (err, res) => {
                    res.should.have.status(204);

                    const ticket = await Ticket.findById(exampleId);

                    ticket.should.have.property("code").equal(updatedTicket.code);
                    ticket.should.have.property("trainnumber").equal(updatedTicket.trainnumber);
                    ticket.should.have.property("traindate").equal(updatedTicket.traindate);

                    done();
                });
        });
    });
});
