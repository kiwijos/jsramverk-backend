/* global it describe */

process.env.NODE_ENV = "test";

import chai from "chai";

// This plugin allows us to make HTTP requests and assertions on those requests
import chaiHttp from "chai-http";

// Import the application server we want to test
import server from "../src/app";

// Use the Chai "should" assertion style
chai.should();

// Tell Chai to use the plugin from before
chai.use(chaiHttp);

// Start the test suite
describe("app", () => {
    
    // Start a nested test suite making a GET request to the "/" route
    describe("GET /", () => {
        it("request results in a 200 status code", (done) => {
            chai.request(server)
                .get("/")
                .end((err, res) => {
                    res.should.have.status(200);

                    done();
                });
        });

        it("response contains correct json data", (done) => {
            chai.request(server)
                .get("/")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a("object");
                    res.body.should.have.property("data");
                    res.body.data.should.equal("Hello World!");

                    done();
                });
        });
    });
});
