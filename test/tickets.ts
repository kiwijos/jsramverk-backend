/* global it describe */

process.env.NODE_ENV = "test";

import chai from "chai";
import chaiHttp from "chai-http";
import server from "../src/index";

import Ticket from "../src/models/Ticket";

chai.should();
chai.use(chaiHttp);

const requestBody = {
    code: "ABC123",
    trainnumber: "12345",
    traindate: "2023-09-20"
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
                        .property("message")
                        .include("Ticket validation failed");
                    done();
                });
        });
    });
});
