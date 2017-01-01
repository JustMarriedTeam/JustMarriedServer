/* global describe, before, after, it */

import request from "supertest";
import httpStatus from "http-status";
import chai, { expect } from "chai";
import app from "../../main/index";

import {
  blueAccount,
  setUpAccounts,
  tearDownAccounts
} from "../data/accounts.data";

import { getTokenFor } from "../utils/auth.utils";

chai.config.includeStack = true;

describe("Tasks", () => {

  let token;

  before((done) => {
    console.log('before');
    setUpAccounts(blueAccount).then((account) => {
      token = getTokenFor(account);
      console.log(token);
    }).finally(done);
  });

  after((done) => tearDownAccounts().then(done));

  describe("GET /api/tasks", () => {
    it("should return OK", (done) => {
      request(app)
        .get("/api/tasks")
        .set("token", token)
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
