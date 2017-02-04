/* global describe, before, after, it */

import Promise from "bluebird";
import request from "supertest";
import httpStatus from "http-status";
import chai, {expect} from "chai";
import app from "../../main/index";
import forEach from "lodash/forEach";
import omit from "lodash/omit";

import {
  redAccount,
  setUpAccounts,
  tearDownAccounts
} from "../data/accounts.data";

import {
  aBlueWedding,
  setUpWeddings,
  tearDownWeddings
} from "../data/wedding.data";

import {
  redTask,
  greenTask,
  blueTask,
  blackTask
} from "../data/tasks.data";

import {getTokenFor} from "../utils/auth.utils";

chai.config.includeStack = true;

describe("Tasks", () => {

  let token;

  const dummyWedding = aBlueWedding()
    .withTasks([
      redTask,
      blueTask,
      greenTask,
      blackTask
    ]).build();

  before(() => Promise.join(
    setUpAccounts(redAccount),
    setUpWeddings(dummyWedding),
    (account) => {
      token = getTokenFor(account);
    }
  ));

  after(() => Promise.join(
    tearDownAccounts(),
    tearDownWeddings()
  ));

  describe("GET /api/wedding/tasks", () => {

    it("can get all tasks assigned to user", () =>
      request(app)
        .get("/api/wedding/tasks")
        .set("token", token)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.lengthOf(3);
          forEach([
            {
              "name": "black task",
              "descri ption": "a black task",
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
        .get("/api/wedding/tasks")
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
        .get("/api/wedding/tasks")
        .query({limit: 1})
        .set("token", token)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.lengthOf(1);
        })
    );

    it("can offset tasks got", () =>
      request(app)
        .get("/api/wedding/tasks")
        .query({offset: 1, limit: 1})
        .set("token", token)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body[0].name).to.be.equal("blue task");
        })
    );

  });

  describe("POST /api/wedding/tasks", () => {

    it("can save a new task", () =>
      request(app)
        .post("/api/wedding/tasks")
        .send({
          name: "test name",
          description: "test description",
          status: "pending"
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
