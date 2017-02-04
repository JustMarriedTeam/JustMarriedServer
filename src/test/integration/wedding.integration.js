/* global describe, before, after, it */
import Promise from "bluebird";
import request from "supertest";
import httpStatus from "http-status";
import chai, {expect} from "chai";
import app from "../../main/index";
import {getTokenFor} from "../utils/auth.utils";
import {withoutIdentifiers} from "../utils/comparison.utils";

import {
  redAccount,
  setUpAccounts,
  tearDownAccounts
} from "../data/accounts.data";

import {
  aWedding,
  setUpWeddings,
  tearDownWeddings
} from "../data/wedding.data";

import {
  redTask,
  blueTask
} from "../data/tasks.data";

import {
  groom,
  bride
} from "../data/participants.data";

describe("Wedding", () => {

  const dummyWedding = aWedding()
    .withOwners([
      groom.user,
      bride.user
    ])
    .withParticipants([
      groom,
      bride
    ]).withTasks([
      redTask,
      blueTask
    ]).withGuests([
      {firstName: "firstNameA", lastName: "lastNameA"},
      {firstName: "firstNameB", lastName: "lastNameB"}
    ]).build();

  let token;

  before(() => Promise.join(
    setUpAccounts(redAccount),
    setUpWeddings(dummyWedding),
    (account) => {
      token = getTokenFor(account);
    }
  ));

  after(() => Promise.join(
    tearDownWeddings(),
    tearDownAccounts(),
  ));

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
            "tasks": [
              {
                "status": "blocked",
                "description": "a red task",
                "name": "red task"
              },
              {
                "status": "done",
                "description": "a blue task",
                "name": "blue task"
              }
            ],
            "owners": [
              {
                "firstName": "smallFirstName",
                "lastName": "smallLastName",
                "username": "smallUsername"
              },
              {
                "firstName": "bigFirstName",
                "lastName": "bigLastName",
                "username": "bigUsername"
              }
            ],
            "participants": [
              {
                "user": {
                  "username": "smallUsername",
                  "firstName": "smallFirstName",
                  "lastName": "smallLastName"
                },
                "role": "groom"
              },
              {
                "user": {
                  "username": "bigUsername",
                  "firstName": "bigFirstName",
                  "lastName": "bigLastName"
                },
                "role": "bride"
              }
            ]
          });
        })
    );

  });

});

chai.config.includeStack = true;
