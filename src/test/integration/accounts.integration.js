/* global describe, beforeEach, afterEach, it */
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

  beforeEach(() => setUpMinimal((account) => {
    token = getTokenFor(account);
  }));

  afterEach(() => tearDownMinimal());

  describe("GET /api/accounts", () => {

    it("can get account of acting user", () =>
      request(app)
        .get("/api/accounts")
        .set("token", token)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(withoutIdentifiers(res.body)).to.deep.equal({
            "assignments": [
              {
                "action": "FILL_WEDDING",
                "done": false
              }
            ],
            "user": {
              "firstName": "miniFirstName",
              "lastName": "miniLastName"
            }
          });
        })
    );

  });

  describe("POST /api/accounts", () => {

    it("Can save a new account", () =>
      request(app)
        .post("/api/accounts")
        .send({
          "login": "kboom@test.com",
          "password": "babelek321A",
          "user": {
            "firstName": "Antoni",
            "lastName": "Leszcz"
          }
        })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(withoutIdentifiers(res.body)).to.deep.equal({
            "assignments": [
              {
                "action": "FILL_WEDDING",
                "done": false
              }
            ],
            "login": "kboom@test.com",
            "user": {
              "firstName": "Antoni",
              "lastName": "Leszcz"
            }
          });
        })
    );

    it("Adds fill wedding assignments as a first assignment", () =>
      request(app)
        .post("/api/accounts")
        .send({
          "login": "kboom@test.com",
          "password": "babelek321A",
          "user": {
            "firstName": "Antoni",
            "lastName": "Leszcz"
          }
        })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(withoutIdentifiers(res.body.assignments)).to.eql([
            {
              "action": "FILL_WEDDING",
              "done": false
            }
          ]);
        })
    );

    it("Creates a wedding for a manually created account", () =>
      request(app)
        .post("/api/accounts")
        .send({
          "login": "kboom@test.com",
          "password": "babelek321A",
          "user": {
            "firstName": "Antoni",
            "lastName": "Leszcz"
          }
        })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(withoutIdentifiers(res.body.assignments)).to.eql([
            {
              "action": "FILL_WEDDING",
              "done": false
            }
          ]);
        })
    );

  });

});
