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

  describe("POST /api/wedding", () => {

    it("can save wedding", () =>
      request(app)
        .post("/api/wedding")
        .send({
          "guests": [
            {
              "firstName": "Leszek",
              "lastName": "Orzeszek"
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
          ]
        })
        .set("token", token)
        .expect(httpStatus.CREATED)
        .then((res) => {
          expect(withoutIdentifiers(res.body)).to.deep.equal({
            "guests": [
              {
                "firstName": "Leszek",
                "lastName": "Orzeszek"
              }
            ],
            "owners": [
              {
                "firstName": "redFirstName",
                "lastName": "redLastName",
                "username": "redUsername"
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
            "tasks": []
          });
        })
    );

  });


  describe("PUT /api/wedding", () => {

    it("can update wedding", () =>
      request(app)
        .put("/api/wedding")
        .send({
          "guests": [
            {
              "firstName": "Zbyszek",
              "lastName": "Grzybek"
            },
            {
              "firstName": "Piotrek",
              "lastName": "Dziabek"
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
            },
            {
              "role": "bridesMaid",
              "user": {
                "firstName": "bridesmaidFirstName",
                "lastName": "bridesmaidLastName",
                "username": "dummyBridesmaid"
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
            }
          ]
        })
        .set("token", token)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(withoutIdentifiers(res.body)).to.deep.equal({
            "guests": [
              {
                "firstName": "Zbyszek",
                "lastName": "Grzybek"
              },
              {
                "firstName": "Piotrek",
                "lastName": "Dziabek"
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
              },
              {
                "role": "bridesMaid",
                "user": {
                  "firstName": "bridesmaidFirstName",
                  "lastName": "bridesmaidLastName",
                  "username": "dummyBridesmaid"
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
              }
            ]
          });
        })
    );

  });

});

chai.config.includeStack = true;
