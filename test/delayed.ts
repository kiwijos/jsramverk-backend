/* global it describe */

process.env.NODE_ENV = "test";

import chai from "chai";
import chaiHttp from "chai-http";
import server from "../src/index";

chai.should();
chai.use(chaiHttp);

describe("delayed", () => {
    describe("GET /delayed", () => {
        it("request results in a 200 status code", (done) => {
            chai.request(server)
                .get("/delayed")
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it("response contains correct json data", (done) => {
            chai.request(server)
                .get("/delayed")
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
});
