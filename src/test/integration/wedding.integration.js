/* global describe, before, after, it */
import request from "supertest";
import httpStatus from "http-status";
import chai, {expect} from "chai";
import app from "../../main/index";
import {getTokenFor} from "../utils/auth.utils";
import {withoutIdentifiers} from "../utils/comparison.utils";
import {setUpColored, tearDownColored} from "../data/colored.set";

describe("Wedding", () => {

  let token;

  before(() => setUpColored((account) => {
    token = getTokenFor(account);
  }));

  after(() => tearDownColored());

  describe("GET /api/wedding", () => {

    it("can get wedding", () =>
      request(app)
        .get("/api/wedding")
        .set("token", token)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(withoutIdentifiers(res.body)).to.deep.equal({
            "guests": [
              {
                "firstName": "firstNameA",
                "lastName": "lastNameA",
              },
              {
                "firstName": "firstNameB",
                "lastName": "lastNameB"
              }
            ],
            "owners": [
              {
                "firstName": "redFirstName",
                "lastName": "redLastName",
                "username": "redUsername"
              },
              {
                "firstName": "greenFirstName",
                "lastName": "greenLastName",
                "username": "greenUsername"
              }
            ],
            "participants": [
              {
                "role": "groom",
                "user": {
                  "firstName": "redFirstName",
                  "lastName": "redLastName",
                  "username": "redUsername"
                }
              },
              {
                "role": "bride",
                "user": {
                  "firstName": "greenFirstName",
                  "lastName": "greenLastName",
                  "username": "greenUsername"
                }
              }
            ],
            "tasks": [
              {
                "description": "a red task",
                "name": "red task",
                "status": "blocked"
              },
              {
                "description": "a blue task",
                "name": "blue task",
                "status": "done"
              },
              {
                "description": "a green task",
                "name": "green task",
                "status": "pending"
              },
              {
                "description": "a black task",
                "name": "black task",
                "status": "blocked"
              }
            ]
          });
        })
    );

  });

});

chai.config.includeStack = true;
