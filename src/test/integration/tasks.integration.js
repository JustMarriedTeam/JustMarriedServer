/* global describe, beforeEach, afterEach, it */
import chai, {expect} from "chai";
import extend from "lodash/extend";
import {setUpColored, tearDownColored} from "../data/colored.set";
import {createTask, updateTask} from "../../main/domain/services/task.service";
import {runFromAccount} from "../actions/context.action";
import {getTasksForAccount} from "../actions/tasks.actions";

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
        return Promise.resolve(getTasks()).then((allTasks) => ({ task, allTasks }));
      }).then(({task, allTasks}) => expect(allTasks.id(coloredSet.redTask.id).dependingOn)
          .to.include(task._id))
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

});
