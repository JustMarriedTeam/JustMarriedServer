/* global describe, beforeEach, afterEach, it */
import request from "supertest";
import httpStatus from "http-status";
import chai, {expect} from "chai";
import app from "../../main/index";
import {withoutIdentifiers} from "../utils/comparison.utils";
import {getTokenFor} from "../utils/auth.utils";
import {setUpMinimal, tearDownMinimal} from "../data/minimal.set";

chai.config.includeStack = true;

const ANY_WEDDING = {
  "guests": [
    {
      "firstName": "Leszek",
      "lastName": "Orzeszek"
    }
  ],
  "participants": [
    {
      "role": "groom",
      "active": true,
      "user": {
        "firstName": "redFirstName",
        "lastName": "redLastName"
      }
    },
    {
      "role": "bride",
      "active": true,
      "user": {
        "firstName": "greenFirstName",
        "lastName": "greenLastName"
      }
    }
  ]
};

describe("Assignments", () => {

  let minimalToken;

  beforeEach(() => setUpMinimal((account) => {
    minimalToken = getTokenFor(account);
  }));

  afterEach(() => tearDownMinimal());

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

  it("Marks 'FILL_WEDDING' assignment as done when wedding updated", () =>
    request(app)
      .put("/api/wedding")
      .send(ANY_WEDDING)
      .set("token", minimalToken)
      .expect(httpStatus.OK)
      .then(() => request(app)
        .get("/api/accounts")
        .set("token", minimalToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(withoutIdentifiers(res.body.assignments)).to.eql([
            { action: "FILL_WEDDING", done: true }
          ]);
        }))
  );

});
