/* global describe, before, after, it */
import request from "supertest";
import httpStatus from "http-status";
import chai, {expect} from "chai";
import app from "../../main/index";
import {withoutIdentifiers} from "../utils/comparison.utils";
import {getTokenFor} from "../utils/auth.utils";
import {setUpColored, tearDownColored} from "../data/colored.set";
import extend from "lodash/extend";

chai.config.includeStack = true;

describe("Tasks", () => {

  let token;
  const coloredSet = {};

  before(() => setUpColored((account) => {
    token = getTokenFor(account);
  }, (set) => {
    extend(coloredSet, set);
  }));

  after(() => tearDownColored());

  describe("GET /api/wedding/tasks", () => {

    it("can get all tasks bound to a wedding", () =>
      request(app)
        .get("/api/wedding/tasks")
        .set("token", token)
        .expect(httpStatus.OK)
        .then((res) => {
          const { blackTask, blueTask, redTask, greenTask } = coloredSet;
          expect(res.body).to.deep.equal([
            {
              "id": redTask.id,
              "status": "blocked",
              "description": "a red task",
              "name": "red task",
              "dependingOn": [blackTask.id, greenTask.id],
              "requiredFor": []
            },
            {
              "id": blueTask.id,
              "status": "done",
              "description": "a blue task",
              "name": "blue task",
              "dependingOn": [],
              "requiredFor": [greenTask.id]
            },
            {
              "id": greenTask.id,
              "status": "done",
              "description": "a green task",
              "name": "green task",
              "dependingOn": [blueTask.id],
              "requiredFor": [redTask.id]
            },
            {
              "id": blackTask.id,
              "status": "pending",
              "description": "a black task",
              "name": "black task",
              "dependingOn": [],
              "requiredFor": [redTask.id]
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
            "status": "pending",
            "dependingOn": [],
            "requiredFor": []
          });
        })
    );

  });

});
