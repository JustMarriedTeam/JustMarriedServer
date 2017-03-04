/* global describe, beforeEach, afterEach, it */
import request from "supertest";
import httpStatus from "http-status";
import chai, {expect} from "chai";
import app from "../../main/index";
import {getTokenFor} from "../utils/auth.utils";
import {withoutIdentifiers} from "../utils/comparison.utils";
import {setUpColored, tearDownColored} from "../data/colored.set";
import {setUpMinimal, tearDownMinimal} from "../data/minimal.set";
import cloneDeep from "lodash/cloneDeep";

describe("Wedding", () => {

  let coloredToken;
  let minimalToken;

  beforeEach(() => Promise.all([
    setUpColored((account) => {
      coloredToken = getTokenFor(account);
    }),
    setUpMinimal((account) => {
      minimalToken = getTokenFor(account);
    })
  ]));

  afterEach(() => Promise.all([
    tearDownColored(),
    tearDownMinimal()
  ]));

  describe("GET /api/wedding", () => {

    it("can get wedding", () =>
      request(app)
        .get("/api/wedding")
        .set("token", coloredToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(withoutIdentifiers(res.body)).to.deep.equal({
            "guests": [
              {
                "firstName": "firstNameA",
                "lastName": "lastNameA"
              },
              {
                "firstName": "firstNameB",
                "lastName": "lastNameB"
              }
            ],
            "owners": [
              {
                "firstName": "redFirstName",
                "lastName": "redLastName"
              },
              {
                "firstName": "greenFirstName",
                "lastName": "greenLastName"
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
                "active": false,
                "user": {
                  "firstName": "greenFirstName",
                  "lastName": "greenLastName"
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

  describe("PUT /api/wedding", () => {

    let minimumWedding;

    beforeEach(() => request(app)
      .get("/api/wedding")
      .set("token", minimalToken)
      .then((res) => {
        minimumWedding = res.body;
      }));

    it("does not change a wedding if no changes made", () => {
      const unchangedWedding = cloneDeep(minimumWedding);

      return request(app)
        .put("/api/wedding")
        .send(unchangedWedding)
        .set("token", minimalToken)
        .then(() => {
          return request(app)
            .get("/api/wedding")
            .set("token", minimalToken)
            .then((response) => response.body);
        }).then((retrievedWedding) => {
          expect(retrievedWedding).to.deep.eql(minimumWedding);
        });
    });

    it("removes all sub-documents which are not referenced", () => {
      const modifiedWedding = cloneDeep(minimumWedding);

      modifiedWedding.participants = [];
      modifiedWedding.guests = [];
      modifiedWedding.tasks = [];

      return request(app)
        .put("/api/wedding")
        .send(modifiedWedding)
        .set("token", minimalToken)
        .then(() => {
          return request(app)
            .get("/api/wedding")
            .set("token", minimalToken)
            .then((response) => response.body);
        }).then((updatedWedding) => {
          expect(updatedWedding).to.deep.eql(modifiedWedding);
        });
    });

    it("adds new entities if no id provided", () => {
      const modifiedWedding = cloneDeep(minimumWedding);

      modifiedWedding.participants.push({
        role: "bridesmaid",
        user: {
          firstName: "Anna",
          lastName: "Danna"
        }
      });

      modifiedWedding.guests.push({
        firstName: "John",
        lastName: "Rambo"
      });

      modifiedWedding.tasks.push({
        name: "Do sth",
        description: "or not",
        status: "blocked"
      });

      return request(app)
        .put("/api/wedding")
        .send(modifiedWedding)
        .set("token", minimalToken)
        .then(() => {
          return request(app)
            .get("/api/wedding")
            .set("token", minimalToken)
            .then((response) => response.body);
        }).then((updatedWedding) => {
          expect(withoutIdentifiers(updatedWedding))
            .to.deep.eql(withoutIdentifiers(modifiedWedding));
        });
    });

  });

});

chai.config.includeStack = true;
