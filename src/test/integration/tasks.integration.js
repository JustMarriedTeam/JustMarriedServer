/* global describe, before, after, it */

import Promise from "bluebird";
import request from "supertest";
import httpStatus from "http-status";
import chai, {expect} from "chai";
import app from "../../main/index";
import omit from "lodash/omit";
import {withoutIdentifiers} from "../utils/comparison.utils";

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

    it("can get all tasks bound to a wedding", () =>
      request(app)
        .get("/api/wedding/tasks")
        .set("token", token)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(withoutIdentifiers(res.body)).to.deep.equal([
            {
              "status": "blocked",
              "description": "a red task",
              "name": "red task"
            },
            {
              "status": "done",
              "description": "a blue task",
              "name": "blue task"
            },
            {
              "status": "pending",
              "description": "a green task",
              "name": "green task"
            },
            {
              "status": "blocked",
              "description": "a black task",
              "name": "black task"
            }
          ]);
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
          expect(withoutIdentifiers(res.body)).to.deep.equal({
            "name": "test name",
            "description": "test description",
            "status": "pending"
          });
        })
    );

  });

});
