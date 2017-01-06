/* global describe, before, after, it */

import Promise from "bluebird";
import request from "supertest";
import httpStatus from "http-status";
import chai, {expect} from "chai";
import app from "../../main/index";
import forEach from "lodash/forEach";
import omit from "lodash/omit";

import {
  anAccount,
  setUpAccounts,
  tearDownAccounts
} from "../data/accounts.data";

import {
  smallUser,
  bigUser,
  setUpUsers,
  tearDownUsers
} from "../data/users.data";

import {
  aRedTask,
  aGreenTask,
  aBlueTask,
  aBlackTask,
  setUpTasks,
  tearDownTasks
} from "../data/tasks.data";

import {getTokenFor} from "../utils/auth.utils";

chai.config.includeStack = true;

describe("Tasks", () => {

  let token;

  before(() => Promise.join(
    setUpAccounts(anAccount()
      .withUser(bigUser).build()),
    setUpUsers(bigUser, smallUser),
    setUpTasks(
      aBlackTask().withOwners([bigUser]).build(),
      aGreenTask().withOwners([bigUser]).build(),
      aBlueTask().withOwners([bigUser, smallUser]).build(),
      aRedTask().withOwners([smallUser]).build()
    ),
    (account) => {
      token = getTokenFor(account);
    }
  ));

  after(() => Promise.join(
    tearDownAccounts(),
    tearDownUsers(),
    tearDownTasks()
  ));

  describe("GET /api/tasks", () => {

    it("can get all tasks assigned to user", () =>
      request(app)
        .get("/api/tasks")
        .set("token", token)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.lengthOf(3);
          forEach([
            {
              "name": "black task",
              "description": "a black task",
              "status": "blocked",
              "owners": [
                {
                  "username": "bigUsername"
                }
              ]
            },
            {
              "name": "blue task",
              "description": "a blue task",
              "status": "done",
              "owners": [
                {
                  "username": "smallUsername"
                },
                {
                  "username": "bigUsername"
                }
              ]
            },
            {
              "name": "green task",
              "description": "a green task",
              "status": "pending",
              "owners": [
                {
                  "username": "smallUsername"
                }
              ]
            }
          ], (task) => expect(omit(task, "_id", "owners._id")).to.include(task));
        })
    );

    it("tasks returned are sorted by state and name", () =>
      request(app)
        .get("/api/tasks")
        .set("token", token)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body[0].name).to.be.equal("black task");
          expect(res.body[1].name).to.be.equal("blue task");
          expect(res.body[2].name).to.be.equal("green task");
        })
    );

    it("can limit tasks got", () =>
      request(app)
        .get("/api/tasks")
        .query({limit: 1})
        .set("token", token)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.lengthOf(1);
        })
    );

    it("can offset tasks got", () =>
      request(app)
        .get("/api/tasks")
        .query({offset: 1, limit: 1})
        .set("token", token)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body[0].name).to.be.equal("blue task");
        })
    );

  });

  describe("POST /api/tasks", () => {

    it("can save a new task", () =>
      request(app)
        .post("/api/tasks")
        .send({
          name: "test name",
          description: "test description",
          status: "pending",
          owners: [ bigUser ]
        })
        .set("token", token)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(omit(res.body, "_id", "owners[0]._id")).to.deep.equal({
            "name": "test name",
            "description": "test description",
            "status": "pending",
            "owners": [
              {
                "username": "smallUsername",
                "firstName": "smallFirstName",
                "lastName": "smallLastName",
                "status": "active",
                "actors": []
              }
            ]
          });
        })
    );

  });

});
