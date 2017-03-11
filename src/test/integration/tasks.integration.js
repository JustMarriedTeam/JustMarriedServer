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
      "if no longer lists itself as requiredFor them",
      runFromColoredAccount(
        updateTask(coloredSet.blackTask.id, extend({}, coloredSet.blackTask, {
          requiredFor: []
        })).then(() => expect(coloredSet.redTask.dependingOn)
          .not.to.include(coloredSet.blackTask.id))
      ));

  });

});
