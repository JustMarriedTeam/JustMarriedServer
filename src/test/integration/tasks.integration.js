/* global describe, before, after, it */
import chai, {expect} from "chai";
import extend from "lodash/extend";
import {setUpColored, tearDownColored} from "../data/colored.set";
import {updateTask} from "../../main/domain/services/task.service";
import {runFromAccount} from "../actions/context.action";

chai.config.includeStack = true;

describe("Tasks", () => {

  let runFromColoredAccount;
  const coloredSet = {};

  before(() => setUpColored((account) => {
    runFromColoredAccount = runFromAccount(account);
  }, (set) => {
    extend(coloredSet, set);
  }));

  after(() => tearDownColored());

  describe("updating", () => {

    it("should remove updated task from all tasks dependingOn it " +
      "if no longer lists itself as requiredFor them", () => runFromColoredAccount(
      () => updateTask(coloredSet.blackTask.id, extend({}, coloredSet.blackTask, {
        requiredFor: []
      })).then((tasks) => expect(tasks.id(coloredSet.redTask.id).dependingOn)
        .not.to.include(coloredSet.blackTask._id))
    ));

  });

});
