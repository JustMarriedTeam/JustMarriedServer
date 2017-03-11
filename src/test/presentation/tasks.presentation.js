/* global describe, beforeEach, afterEach, it */
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

  beforeEach(() => setUpColored((account) => {
    token = getTokenFor(account);
  }, (set) => {
    extend(coloredSet, set);
  }));

  afterEach(() => tearDownColored());

  describe("GET /api/wedding/tasks", () => {

    it("can get all tasks bound to a wedding", () =>
      request(app)
        .get("/api/wedding/tasks")
        .set("token", token)
        .expect(httpStatus.OK)
        .then((res) => {
          const { blackTask, blueTask, redTask, pinkTask, greenTask } = coloredSet;
          expect(res.body).to.deep.equal([
            {
              "id": redTask.id,
              "status": "blocked",
              "description": "a red task",
              "name": "red task",
              "dependingOn": [blackTask.id, pinkTask.id],
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
              "status": "pending",
              "description": "a green task",
              "name": "green task",
              "dependingOn": [blackTask.id],
              "requiredFor": [redTask.id]
            },
            {
              "description": "a pink task",
              "id": pinkTask.id,
              "name": "pink task",
              "dependingOn": [greenTask.id, blueTask.id],
              "requiredFor": [redTask.id],
              "status": "blocked"
            },
            {
              "id": blackTask.id,
              "status": "done",
              "description": "a black task",
              "name": "black task",
              "dependingOn": [],
              "requiredFor": [redTask.id, greenTask.id]
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

  describe("PUT /api/wedding/tasks", () => {

    it("can update a task", () =>
      request(app)
        .put(`/api/wedding/tasks/${coloredSet.redTask.id}`)
        .send({
          name: "test name",
          description: "test description",
          status: "pending",
          dependingOn: [coloredSet.blueTask.id],
          requiredFor: [coloredSet.greenTask.id]
        })
        .set("token", token)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(withoutIdentifiers(res.body)).to.deep.equal({
            "name": "test name",
            "description": "test description",
            "status": "pending",
            "dependingOn": [coloredSet.blueTask.id],
            "requiredFor": [coloredSet.greenTask.id]
          });
        })
    );

  });

});
