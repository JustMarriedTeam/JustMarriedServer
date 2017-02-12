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

  // describe("GET /api/wedding", () => {
  //
  //   it("can get wedding", () =>
  //     request(app)
  //       .get("/api/wedding")
  //       .set("token", coloredToken)
  //       .expect(httpStatus.OK)
  //       .then((res) => {
  //         expect(withoutIdentifiers(res.body)).to.deep.equal({
  //           "guests": [
  //             {
  //               "firstName": "firstNameA",
  //               "lastName": "lastNameA"
  //             },
  //             {
  //               "firstName": "firstNameB",
  //               "lastName": "lastNameB"
  //             }
  //           ],
  //           "owners": [
  //             {
  //               "firstName": "redFirstName",
  //               "lastName": "redLastName",
  //               "username": "redUsername"
  //             },
  //             {
  //               "firstName": "greenFirstName",
  //               "lastName": "greenLastName",
  //               "username": "greenUsername"
  //             }
  //           ],
  //           "participants": [
  //             {
  //               "role": "groom",
  //               "active": true,
  //               "user": {
  //                 "firstName": "redFirstName",
  //                 "lastName": "redLastName",
  //                 "username": "redUsername"
  //               }
  //             },
  //             {
  //               "role": "bride",
  //               "active": false,
  //               "user": {
  //                 "firstName": "greenFirstName",
  //                 "lastName": "greenLastName",
  //                 "username": "greenUsername"
  //               }
  //             }
  //           ],
  //           "tasks": [
  //             {
  //               "description": "a red task",
  //               "name": "red task",
  //               "status": "blocked"
  //             },
  //             {
  //               "description": "a blue task",
  //               "name": "blue task",
  //               "status": "done"
  //             },
  //             {
  //               "description": "a green task",
  //               "name": "green task",
  //               "status": "pending"
  //             },
  //             {
  //               "description": "a black task",
  //               "name": "black task",
  //               "status": "blocked"
  //             }
  //           ]
  //         });
  //       })
  //   );
  //
  // });
  //
  // describe("POST /api/wedding", () => {
  //
  //   it("can save wedding", () =>
  //     request(app)
  //       .post("/api/wedding")
  //       .send({
  //         "guests": [
  //           {
  //             "firstName": "Leszek",
  //             "lastName": "Orzeszek"
  //           }
  //         ],
  //         "participants": [
  //           {
  //             "role": "groom",
  //             "active": true,
  //             "user": {
  //               "firstName": "redFirstName",
  //               "lastName": "redLastName",
  //               "username": "redUsername"
  //             }
  //           },
  //           {
  //             "role": "bride",
  //             "active": true,
  //             "user": {
  //               "firstName": "greenFirstName",
  //               "lastName": "greenLastName",
  //               "username": "greenUsername"
  //             }
  //           }
  //         ]
  //       })
  //       .set("token", coloredToken)
  //       .expect(httpStatus.CREATED)
  //       .then((res) => {
  //         expect(withoutIdentifiers(res.body)).to.deep.equal({
  //           "guests": [
  //             {
  //               "firstName": "Leszek",
  //               "lastName": "Orzeszek"
  //             }
  //           ],
  //           "owners": [
  //             {
  //               "firstName": "redFirstName",
  //               "lastName": "redLastName",
  //               "username": "redUsername"
  //             }
  //           ],
  //           "participants": [
  //             {
  //               "role": "groom",
  //               "active": true,
  //               "user": {
  //                 "firstName": "redFirstName",
  //                 "lastName": "redLastName",
  //                 "username": "redUsername"
  //               }
  //             },
  //             {
  //               "role": "bride",
  //               "active": true,
  //               "user": {
  //                 "firstName": "greenFirstName",
  //                 "lastName": "greenLastName",
  //                 "username": "greenUsername"
  //               }
  //             },
  //             {
  //               "active": false,
  //               "role": "bridesmaid"
  //             },
  //             {
  //               "active": false,
  //               "role": "bestMan"
  //             }
  //           ],
  //           "tasks": []
  //         });
  //       })
  //   );
  //
  // });

  describe("PUT /api/wedding", () => {

    let minimumWedding;

    beforeEach(() => request(app)
      .get("/api/wedding")
      .set("token", minimalToken)
      .then((res) => {
        minimumWedding = res.body;
      }));

    it("removes all sub-documents not referenced", () => {
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

    // it("returns updated wedding", () =>
    //   request(app)
    //     .put("/api/wedding")
    //     .send({
    //       "guests": [
    //         {
    //           "firstName": "Zbyszek",
    //           "lastName": "Grzybek"
    //         }
    //       ],
    //       "participants": [
    //         {
    //           "role": "groom",
    //           "user": {
    //             "firstName": "redFirstName",
    //             "lastName": "redLastName",
    //             "username": "redUsername"
    //           }
    //         },
    //         {
    //           "role": "bride",
    //           "user": {
    //             "firstName": "greenFirstName",
    //             "lastName": "greenLastName",
    //             "username": "greenUsername"
    //           }
    //         }
    //       ],
    //       "tasks": [
    //         {
    //           "description": "a modified task",
    //           "name": "modified task",
    //           "status": "pending"
    //         }
    //       ]
    //     })
    //     .set("token", coloredToken)
    //     .expect(httpStatus.OK)
    //     .then((res) => {
    //       expect(withoutIdentifiers(res.body)).to.deep.equal({
    //         "guests": [
    //           {
    //             "firstName": "Zbyszek",
    //             "lastName": "Grzybek"
    //           }
    //         ],
    //         "owners": [
    //           {
    //             "firstName": "redFirstName",
    //             "lastName": "redLastName",
    //             "username": "redUsername"
    //           },
    //           {
    //             "firstName": "greenFirstName",
    //             "lastName": "greenLastName",
    //             "username": "greenUsername"
    //           }
    //         ],
    //         "participants": [
    //           {
    //             "role": "groom",
    //             "user": {
    //               "firstName": "redFirstName",
    //               "lastName": "redLastName",
    //               "username": "redUsername"
    //             }
    //           },
    //           {
    //             "role": "bride",
    //             "user": {
    //               "firstName": "greenFirstName",
    //               "lastName": "greenLastName",
    //               "username": "greenUsername"
    //             }
    //           }
    //         ],
    //         "tasks": [
    //           {
    //             "description": "a modified task",
    //             "name": "modified task",
    //             "status": "pending"
    //           }
    //         ]
    //       });
    //     })
    // );


    it("does not change wedding if posted the same", () =>
      request(app)
        .get("/api/wedding")
        .set("token", minimalToken)
        .then((res) => res.body)
        .then((existingWedding) => {
          return request(app)
            .put("/api/wedding")
            .send(existingWedding)
            .set("token", minimalToken)
            .then(() => existingWedding);
        }).then((existingWedding) => {
          return request(app)
          .get("/api/wedding")
          .set("token", minimalToken)
          .then((response) => ({updatedWedding: response.body, existingWedding}));
        }).then(({existingWedding, updatedWedding}) => {
          expect(updatedWedding).to.deep.eql(existingWedding);
        })
    );


  });

});

chai.config.includeStack = true;
