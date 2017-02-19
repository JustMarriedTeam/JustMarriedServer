/* global describe, before, after, it */
import request from "supertest";
import httpStatus from "http-status";
import chai, {expect} from "chai";
import app from "../../main/index";
import {withoutIdentifiers} from "../utils/comparison.utils";
import {getTokenFor} from "../utils/auth.utils";
import {setUpMinimal, tearDownMinimal} from "../data/minimal.set";

chai.config.includeStack = true;

describe("Accounts", () => {

  let token;

  before(() => setUpMinimal((account) => {
    token = getTokenFor(account);
  }));

  after(() => tearDownMinimal());

  describe("GET /api/accounts", () => {

    it("can get account of acting user", () =>
      request(app)
        .get("/api/accounts")
        .set("token", token)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(withoutIdentifiers(res.body)).to.deep.equal({
            "user": {
              "firstName": "miniFirstName",
              "lastName": "miniLastName",
              "username": "miniUsername"
            }
          });
        })
    );

  });

});
