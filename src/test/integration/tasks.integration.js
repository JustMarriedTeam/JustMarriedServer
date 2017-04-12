/* global describe, beforeEach, afterEach, it */
import chai, {expect} from "chai";
import chaiAsPromised from "chai-as-promised";
import extend from "lodash/extend";
import find from "lodash/fp/find";
import map from "lodash/fp/map";
import forEach from "lodash/fp/forEach";
import {setUpColored, tearDownColored} from "../data/colored.set";
import {
  createTask,
  updateTask,
  removeTask,
  cloneFromTaskTemplates
} from "../../main/domain/services/task.service";
import {runFromAccount} from "../actions/context.action";
import {getTasksForAccount} from "../actions/tasks.actions";

chai.use(chaiAsPromised);
chai.config.includeStack = true;

describe("Tasks", () => {

  let runFromColoredAccount;
  let getTasks;
  const coloredSet = {};

  beforeEach(() => setUpColored((account) => {
    runFromColoredAccount = runFromAccount(account);
    getTasks = getTasksForAccount(account);
  }, (set) => {
    extend(coloredSet, set);
  }));

  afterEach(() => tearDownColored());

  describe("creating", () => {

    it("should add new task to all tasks dependingOn it " +
      "if it lists itself as requiredFor them", () => runFromColoredAccount(
      () => createTask({
        name: "test name",
        description: "test description",
        status: "blocked",
        requiredFor: [coloredSet.redTask.id]
      }).then((task) => {
        return getTasks().then((allTasks) =>
          expect(allTasks.id(coloredSet.redTask.id).dependingOn).to.include(task._id));
      })
    ));

    it("should add new task to all tasks requiredFor " +
      "if it lists itself as dependingOn them", () => runFromColoredAccount(
      () => createTask({
        name: "test name",
        description: "test description",
        status: "blocked",
        dependingOn: [coloredSet.redTask.id]
      }).then((task) => {
        return getTasks().then((allTasks) =>
          expect(allTasks.id(coloredSet.redTask.id).requiredFor).to.include(task._id));
      })
    ));

  });

  describe("updating", () => {

    it("should remove updated task from all tasks dependingOn it " +
      "if no longer lists itself as requiredFor them", () => runFromColoredAccount(
      () => updateTask(coloredSet.blackTask.id, extend({}, coloredSet.blackTask, {
        requiredFor: [coloredSet.blackTask.id]
      })).then(getTasks).then((tasks) => expect(tasks.id(coloredSet.greenTask.id).dependingOn)
        .not.to.include(coloredSet.blackTask._id))
    ));

    it("should add updated task to all tasks dependingOn " +
      "if it lists itself as requiredFor them", () => runFromColoredAccount(
      () => updateTask(coloredSet.blackTask.id, extend({}, coloredSet.blackTask, {
        requiredFor: [coloredSet.blueTask.id]
      })).then(getTasks).then((tasks) => expect(tasks.id(coloredSet.blueTask.id).dependingOn)
        .to.include(coloredSet.blackTask._id))
    ));

    it("should remove updated task from all tasks requiredFor " +
      "if it no longer lists itself as dependingOn them", () => runFromColoredAccount(
      () => updateTask(coloredSet.redTask.id, extend({}, coloredSet.redTask, {
        dependingOn: [coloredSet.pinkTask.id]
      })).then(getTasks).then((tasks) => expect(tasks.id(coloredSet.blackTask.id).requiredFor)
        .not.to.include(coloredSet.redTask._id))
    ));

    it("should add updated task from all tasks requiredFor " +
      "if it lists itself as dependingOn them", () => runFromColoredAccount(
      () => updateTask(coloredSet.greenTask.id, extend({}, coloredSet.greenTask, {
        dependingOn: [coloredSet.blueTask.id]
      })).then(getTasks).then((tasks) => expect(tasks.id(coloredSet.blueTask.id).requiredFor)
        .to.include(coloredSet.greenTask._id))
    ));

    it("should not remove updated task from all tasks dependingOn " +
      "if it lists itself still requiredFor them", () => runFromColoredAccount(
      () => updateTask(coloredSet.blackTask.id, extend({}, coloredSet.blackTask, {
        requiredFor: [coloredSet.redTask.id]
      })).then(getTasks).then((tasks) => expect(tasks.id(coloredSet.redTask.id).dependingOn)
        .to.include(coloredSet.blackTask._id))
    ));

    it("should not remove updated task from all tasks requiredFor " +
      "if it lists itself still depending on them", () => runFromColoredAccount(
      () => updateTask(coloredSet.redTask.id, extend({}, coloredSet.redTask, {
        dependingOn: [coloredSet.greenTask.id]
      })).then(getTasks).then((tasks) => expect(tasks.id(coloredSet.greenTask.id).requiredFor)
        .to.include(coloredSet.redTask._id))
    ));

    it("should replace all fields with the ones given", () => runFromColoredAccount(
      () => updateTask(coloredSet.pinkTask.id, {
        name: "new red",
        description: "new red description",
        status: "pending",
        requiredFor: [coloredSet.blueTask.id],
        dependingOn: []
      })).then((task) => expect(JSON.parse(JSON.stringify(task))).to.eql({
        id: coloredSet.pinkTask.id,
        name: "new red",
        description: "new red description",
        status: "pending",
        requiredFor: [coloredSet.blueTask.id],
        dependingOn: []
      })
    ));


  });

  describe("deleting", () => {

    it("should remove task", () => runFromColoredAccount(
      () => removeTask(coloredSet.blackTask.id)
        .then(getTasks)
        .then((tasks) => expect(tasks).not.to.include(coloredSet.blackTask))
    ));

    it("should remove task from all dependingOn of other tasks", () => runFromColoredAccount(
      () => removeTask(coloredSet.blackTask.id)
        .then(getTasks)
        .then((tasks) => forEach((task) =>
          expect(task.dependingOn).not.to.include(coloredSet.blackTask._id)
        )(tasks))
    ));

    it("should remove task from all requiredFor of other tasks", () => runFromColoredAccount(
      () => removeTask(coloredSet.blackTask.id)
        .then(getTasks)
        .then((tasks) => forEach((task) =>
          expect(task.requiredFor).not.to.include(coloredSet.blackTask._id)
        )(tasks))
    ));

  });

  describe("cloning", () => {

    const mapToIds = map((task) => task.id);

    it("should clone tasks respecting relations", () => runFromColoredAccount(
      () => cloneFromTaskTemplates([
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
          "name": "system task 3",
          "requiredFor": []
        }]).then((clonedTasks) => {
          const firstTask = find({name: "system task 1"})(clonedTasks);
          const secondTask = find({name: "system task 2"})(clonedTasks);
          const thirdTask = find({name: "system task 3"})(clonedTasks);

          expect(mapToIds(firstTask.requiredFor)).to.eql([secondTask.id, thirdTask.id]);
          expect(mapToIds(firstTask.dependingOn)).to.be.empty;
          expect(mapToIds(secondTask.requiredFor)).to.eql([thirdTask.id]);
          expect(mapToIds(secondTask.dependingOn)).to.eql([firstTask.id]);
          expect(mapToIds(thirdTask.requiredFor)).to.be.empty;
          expect(mapToIds(thirdTask.dependingOn)).to.eql([firstTask.id, secondTask.id]);
        })
    ));

    it("should make dependent tasks blocked", () => runFromColoredAccount(
      () => cloneFromTaskTemplates([
        {
          "id": "1",
          "name": "pending task",
          "description": "dummy",
          "requiredFor": ["2"],
          "dependingOn": []
        },
        {
          "id": "2",
          "name": "blocked task",
          "description": "dummy",
          "dependingOn": ["1"],
          "requiredFor": []
        }]).then((clonedTasks) => {
          const blockedTask = find({name: "blocked task"})(clonedTasks);
          expect(blockedTask.status).to.eql("blocked");
        })
    ));

    it("should make independent tasks pending", () => runFromColoredAccount(
      () => cloneFromTaskTemplates([{
        "id": "1",
        "name": "pending task",
        "description": "dummy",
        "requiredFor": [],
        "dependingOn": []
      }]).then((clonedTasks) => {
        const pendingTask = find({name: "pending task"})(clonedTasks);
        expect(pendingTask.status).to.eql("pending");
      })
    ));

    it("should fail if dependency is missing", () => runFromColoredAccount(
      () => expect(cloneFromTaskTemplates([{
        "id": "1",
        "name": "pending task",
        "description": "dummy",
        "requiredFor": ["2"],
        "dependingOn": []
      }])).to.be.rejectedWith("Inconsistent dependencies")
    ));

  });

});
