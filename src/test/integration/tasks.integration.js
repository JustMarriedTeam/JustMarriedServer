/* global describe, beforeEach, afterEach, it */
import chai, {expect} from "chai";
import extend from "lodash/extend";
import {setUpColored, tearDownColored} from "../data/colored.set";
import {updateTask} from "../../main/domain/services/task.service";
import {runFromAccount} from "../actions/context.action";

chai.config.includeStack = true;

describe("Tasks", () => {

  let runFromColoredAccount;
  const coloredSet = {};

  beforeEach(() => setUpColored((account) => {
    runFromColoredAccount = runFromAccount(account);
  }, (set) => {
    extend(coloredSet, set);
  }));

  afterEach(() => tearDownColored());

  describe("updating", () => {

    it("should remove updated task from all tasks dependingOn it " +
      "if no longer lists itself as requiredFor them", () => runFromColoredAccount(
      () => updateTask(coloredSet.blackTask.id, extend({}, coloredSet.blackTask, {
        requiredFor: [coloredSet.blackTask.id]
      })).then((tasks) => expect(tasks.id(coloredSet.greenTask.id).dependingOn)
        .not.to.include(coloredSet.blackTask._id))
    ));

    it("should add updated task to all tasks dependingOn " +
      "if it lists itself as requiredFor them", () => runFromColoredAccount(
      () => updateTask(coloredSet.blackTask.id, extend({}, coloredSet.blackTask, {
        requiredFor: [coloredSet.blueTask.id]
      })).then((tasks) => expect(tasks.id(coloredSet.blueTask.id).dependingOn)
        .to.include(coloredSet.blackTask._id))
    ));

    it("should remove updated task from all tasks requiredFor " +
      "if it no longer lists itself as dependingOn them", () => runFromColoredAccount(
      () => updateTask(coloredSet.redTask.id, extend({}, coloredSet.redTask, {
        dependingOn: [coloredSet.pinkTask.id]
      })).then((tasks) => expect(tasks.id(coloredSet.blackTask.id).requiredFor)
        .not.to.include(coloredSet.redTask._id))
    ));

    it("should add updated task from all tasks requiredFor " +
      "if it lists itself as dependingOn them", () => runFromColoredAccount(
      () => updateTask(coloredSet.greenTask.id, extend({}, coloredSet.greenTask, {
        dependingOn: [coloredSet.blueTask.id]
      })).then((tasks) => expect(tasks.id(coloredSet.blueTask.id).requiredFor)
        .to.include(coloredSet.greenTask._id))
    ));

  });

});
