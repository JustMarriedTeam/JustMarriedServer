/* global describe, before, after, it */

import Promise from "bluebird";
import request from "supertest";
import httpStatus from "http-status";
import chai, { expect } from "chai";
import app from "../../main/index";

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

import { getTokenFor } from "../utils/auth.utils";

chai.config.includeStack = true;

describe("Tasks", () => {

  let token;

  before((done) => {
    Promise.join(
      setUpAccounts(blueAccount),
      setUpTasks(redTask, greenTask, blueTask),
        (account) => {
          token = getTokenFor(account);
        }
    ).finally(done);
  });

  after((done) => Promise.all(
    tearDownAccounts(),
    tearDownTasks()
  ).finally(done));

  describe("GET /api/tasks", () => {

    it("should return OK", (done) => {
      request(app)
        .get("/api/tasks")
        .set("token", token)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.deep.equal({
            text: "Hi there!"
          });
          done();
        })
        .catch(done);
    });

  });

});
