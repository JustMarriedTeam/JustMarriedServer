/* global describe, beforeEach, afterEach, it */
import request from "supertest";
import httpStatus from "http-status";
import chai, {expect} from "chai";
import app from "../../main/index";
import {withoutIdentifiers} from "../utils/comparison.utils";
import {getTokenFor} from "../utils/auth.utils";
import {setUpColored, tearDownColored} from "../data/colored.set";
import {setUpSystem, tearDownSystem} from "../data/system.set";
import extend from "lodash/extend";

chai.config.includeStack = true;
process.env.TZ = "Europe/Warsaw";

describe("Tasks", () => {

  let token;
  const coloredSet = {};
  const systemSet = {};

  beforeEach(() => Promise.all([

    setUpColored((account) => {
      token = getTokenFor(account);
    }, (set) => {
      extend(coloredSet, set);
    }),

    setUpSystem(() => null, (set) => {
      extend(systemSet, set);
    })

  ]));

  afterEach(() => Promise.all([
    tearDownColored(),
    tearDownSystem()
  ]));


  // describe("GET /api/templates/tasks", () => {
  //
  //   it("should return template tasks", () => request(app)
  //     .get("/api/templates/tasks")
  //     .set("token", token)
  //     .expect(httpStatus.OK)
  //     .then((res) => {
  //       const {systemTask1, systemTask2, systemTask3, systemTask4, systemTask5} = systemSet;
  //       expect(res.body).to.deep.include.members([
  //         {
  //           "dependingOn": [],
  //           "description": "a nice task no. 1",
  //           "id": systemTask1.id,
  //           "name": "system task 1",
  //           "requiredFor": [
  //             systemTask5.id,
  //             systemTask3.id
  //           ],
  //           "status": "done"
  //         },
  //         {
  //           "dependingOn": [],
  //           "description": "a nice task no. 2",
  //           "id": systemTask2.id,
  //           "name": "system task 2",
  //           "requiredFor": [
  //             systemTask3.id
  //           ],
  //           "status": "done"
  //         },
  //         {
  //           "dependingOn": [
  //             systemTask1.id
  //           ],
  //           "description": "a nice task no. 3",
  //           "id": systemTask3.id,
  //           "name": "system task 3",
  //           "requiredFor": [
  //             systemTask5.id
  //           ],
  //           "status": "pending"
  //         },
  //         {
  //           "dependingOn": [
  //             systemTask3.id,
  //             systemTask2.id
  //           ],
  //           "description": "a nice task no. 4",
  //           "id": systemTask4.id,
  //           "name": "system task 4",
  //           "requiredFor": [
  //             systemTask5.id
  //           ],
  //           "status": "blocked"
  //         },
  //         {
  //           "dependingOn": [
  //             systemTask1.id,
  //             systemTask4.id
  //           ],
  //           "description": "a nice task no. 5",
  //           "id": systemTask5.id,
  //           "name": "system task 5",
  //           "requiredFor": [],
  //           "status": "blocked"
  //         }
  //       ]);
  //     })
  //   );
  //
  // });
  //
  // describe("GET /api/wedding/tasks", () => {
  //
  //   it("can get all tasks bound to a wedding", () =>
  //     request(app)
  //       .get("/api/wedding/tasks")
  //       .set("token", token)
  //       .expect(httpStatus.OK)
  //       .then((res) => {
  //         const {blackTask, blueTask, redTask, pinkTask, greenTask} = coloredSet;
  //         expect(res.body).to.deep.equal([
  //           {
  //             "id": redTask.id,
  //             "status": "blocked",
  //             "description": "a red task",
  //             "name": "red task",
  //             "dependingOn": [blackTask.id, pinkTask.id],
  //             "requiredFor": [],
  //             "deadlineDate": "2018-01-30T23:00:00.000Z"
  //           },
  //           {
  //             "id": blueTask.id,
  //             "status": "done",
  //             "description": "a blue task",
  //             "name": "blue task",
  //             "dependingOn": [],
  //             "requiredFor": [greenTask.id],
  //             "completionDate": "2017-03-31T22:00:00.000Z",
  //             "deadlineDate": "2017-04-20T22:00:00.000Z"
  //           },
  //           {
  //             "id": greenTask.id,
  //             "status": "pending",
  //             "description": "a green task",
  //             "name": "green task",
  //             "dependingOn": [blackTask.id],
  //             "requiredFor": [redTask.id],
  //             "deadlineDate": "2017-11-11T23:00:00.000Z"
  //           },
  //           {
  //             "description": "a pink task",
  //             "id": pinkTask.id,
  //             "name": "pink task",
  //             "dependingOn": [greenTask.id, blueTask.id],
  //             "requiredFor": [redTask.id],
  //             "status": "blocked"
  //           },
  //           {
  //             "id": blackTask.id,
  //             "status": "done",
  //             "description": "a black task",
  //             "name": "black task",
  //             "dependingOn": [],
  //             "requiredFor": [redTask.id, greenTask.id],
  //             "completionDate": "2017-03-09T23:00:00.000Z",
  //             "deadlineDate": "2017-03-10T23:00:00.000Z"
  //           }
  //         ]);
  //       })
  //   );
  //
  // });
  //
  // describe("POST /api/wedding/tasks", () => {
  //
  //   it("can save a new task", () =>
  //     request(app)
  //       .post("/api/wedding/tasks")
  //       .send({
  //         name: "test name",
  //         description: "test description",
  //         status: "pending",
  //         dependingOn: [coloredSet.blueTask.id],
  //         requiredFor: [coloredSet.redTask.id, coloredSet.greenTask.id]
  //       })
  //       .set("token", token)
  //       .expect(httpStatus.OK)
  //       .then((res) => {
  //         expect(withoutIdentifiers(res.body)).to.deep.equal({
  //           name: "test name",
  //           description: "test description",
  //           status: "pending",
  //           dependingOn: [coloredSet.blueTask.id],
  //           requiredFor: [coloredSet.redTask.id, coloredSet.greenTask.id]
  //         });
  //       })
  //   );
  //
  // });
  //
  // describe("PUT /api/wedding/tasks/{taskId}", () => {
  //
  //   it("can update a task", () =>
  //     request(app)
  //       .put(`/api/wedding/tasks/${coloredSet.redTask.id}`)
  //       .send({
  //         name: "test name",
  //         description: "test description",
  //         status: "pending",
  //         dependingOn: [coloredSet.blueTask.id],
  //         requiredFor: [coloredSet.greenTask.id],
  //         deadlineDate: "2018-03-31T23:00:00.000Z",
  //         completionDate: "2018-03-31T23:00:00.000Z"
  //       })
  //       .set("token", token)
  //       .expect(httpStatus.OK)
  //       .then((res) => {
  //         expect(withoutIdentifiers(res.body)).to.deep.equal({
  //           "name": "test name",
  //           "description": "test description",
  //           "status": "pending",
  //           "dependingOn": [coloredSet.blueTask.id],
  //           "requiredFor": [coloredSet.greenTask.id],
  //           "deadlineDate": "2018-03-31T23:00:00.000Z",
  //           "completionDate": "2018-03-31T23:00:00.000Z"
  //         });
  //       })
  //   );
  //
  // });
  //
  // describe("DELETE /api/wedding/task/{taskId}", () => {
  //
  //   it("can delete a task", () => request(app)
  //     .delete(`/api/wedding/tasks/${coloredSet.redTask.id}`)
  //     .set("token", token)
  //     .expect(httpStatus.NO_CONTENT));
  //
  // });

  describe("POST /api/wedding/clone/tasks", () => {

    it("can clone tasks", () =>
      request(app)
        .post("/api/wedding/clone/tasks")
        .send([
          {
            "dependingOn": [],
            "description": "a nice task no. 1",
            "id": "1",
            "name": "system task 1",
            "requiredFor": ["2", "3"]
          },
          {
            "dependingOn": ["1"],
            "description": "a nice task no. 2",
            "id": "2",
            "name": "system task 2",
            "requiredFor": [
              "3"
            ]
          },
          {
            "dependingOn": ["1", "2"],
            "description": "a nice task no. 3",
            "id": "3",
            "name": "system task 2",
            "requiredFor": []
          }
        ])
        .set("token", token)
        .expect(httpStatus.OK)
        .then((res) => {
          // do something
        })
    );

  });

});
