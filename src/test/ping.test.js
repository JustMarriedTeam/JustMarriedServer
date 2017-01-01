/* global describe, it */

import request from "supertest";
import httpStatus from "http-status";
import chai, { expect } from "chai";
import app from "../main/index";

chai.config.includeStack = true;

describe("Ping test", () => {

  describe("# GET /api/ping", () => {
    it("should return OK", (done) => {
      request(app)
        .get("/api/ping")
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.deep.equal({
            text: "Hi there!"
          });
          done();
        })
        .catch(done);
    });
  });

});
