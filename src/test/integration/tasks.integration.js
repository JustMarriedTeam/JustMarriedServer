/* global describe, before, after, it */
import request from "supertest";
import httpStatus from "http-status";
import chai, {expect} from "chai";
import app from "../../main/index";
import {withoutIdentifiers} from "../utils/comparison.utils";
import {getTokenFor} from "../utils/auth.utils";
import {setUpColored, tearDownColored} from "../data/colored.set";

chai.config.includeStack = true;

describe("Tasks", () => {

  let token;

  before(() => setUpColored((account) => {
    token = getTokenFor(account);
  }));

  after(() => tearDownColored());

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
              "name": "red task",
              "dependingOn": [],
              "requiredFor": []
            },
            {
              "status": "done",
              "description": "a blue task",
              "name": "blue task",
              "dependingOn": [],
              "requiredFor": []
            },
            {
              "status": "pending",
              "description": "a green task",
              "name": "green task",
              "dependingOn": [],
              "requiredFor": []
            },
            {
              "status": "blocked",
              "description": "a black task",
              "name": "black task",
              "dependingOn": [],
              "requiredFor": []
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
