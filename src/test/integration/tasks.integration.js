/* global describe, before, after, it */

import Promise from "bluebird";
import request from "supertest";
import httpStatus from "http-status";
import chai, {expect} from "chai";
import app from "../../main/index";
import forEach from "lodash/forEach";

import {
  blueAccount,
  setUpAccounts,
  tearDownAccounts
} from "../data/accounts.data";

import {
  redTask,
  greenTask,
  blueTask,
  setUpTasks,
  tearDownTasks
} from "../data/tasks.data";

import {getTokenFor} from "../utils/auth.utils";

chai.config.includeStack = true;

describe("Tasks", () => {

  let token;

  before(() => Promise.join(
    setUpAccounts(blueAccount),
    setUpTasks(redTask, greenTask, blueTask),
    (account) => {
      token = getTokenFor(account);
    }
  ));

  after(() => Promise.join(
    tearDownAccounts(),
    tearDownTasks()
  ));

  describe("GET /api/tasks", () => {

    it("can get all tasks", () =>
      request(app)
        .get("/api/tasks")
        .set("token", token)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.lengthOf(3);
          forEach([
            {
              "name": "red task",
              "status": "blocked"
            },
            {
              "name": "green task",
              "status": "pending"
            },
            {
              "name": "blue task",
              "status": "done"
            }
          ], (task, index) => expect(res.body[index]).to.be.deep.equal(task));
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
          expect(res.body).to.be.deep.equal([
            {
              "name": "red task",
              "status": "blocked"
            }
          ]);
        })
    );

  });

});
