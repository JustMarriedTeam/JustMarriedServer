/**
 * This data set contains all system entities which are independent on any particular wedding.
 */
import Promise from "bluebird";
import noop from "lodash/fp/noop";
import {generateObjectId} from "../utils/id.generator";
import {aTask, setUpTasks, tearDownTasks} from "../builders/task.builder";
import {TASK_STATUS} from "../../main/domain/models/task.model";

function createSet() {

  const systemTask1Id = generateObjectId();
  const systemTask2Id = generateObjectId();
  const systemTask3Id = generateObjectId();
  const systemTask5Id = generateObjectId();
  const systemTask4Id = generateObjectId();

  const systemTask1 = aTask(systemTask1Id)
    .withName("system task 1")
    .withDescription("a nice task no. 1")
    .withStatus(TASK_STATUS.DONE)
    .withRequiredFor([systemTask5Id, systemTask3Id])
    .build();

  const systemTask2 = aTask(systemTask2Id)
    .withName("system task 2")
    .withDescription("a nice task no. 2")
    .withStatus(TASK_STATUS.DONE)
    .withRequiredFor([systemTask3Id])
    .build();

  const systemTask3 = aTask(systemTask3Id)
    .withName("system task 3")
    .withDescription("a nice task no. 3")
    .withStatus(TASK_STATUS.PENDING)
    .withDependingOn([systemTask1])
    .withRequiredFor([systemTask5Id])
    .build();

  const systemTask4 = aTask(systemTask4Id)
    .withName("system task 4")
    .withDescription("a nice task no. 4")
    .withStatus(TASK_STATUS.BLOCKED)
    .withDependingOn([systemTask3, systemTask2])
    .withRequiredFor([systemTask5Id])
    .build();

  const systemTask5 = aTask(systemTask5Id)
    .withName("system task 5")
    .withDescription("a nice task no. 5")
    .withStatus(TASK_STATUS.BLOCKED)
    .withDependingOn([systemTask1, systemTask4])
    .build();

  return {
    systemTask1,
    systemTask2,
    systemTask3,
    systemTask4,
    systemTask5
  };

}

function setUpSystem(callback, bindValues = noop) {
  const set = createSet();

  const {
    systemTask1,
    systemTask2,
    systemTask3,
    systemTask4,
    systemTask5
  } = set;

  return Promise.join(
    setUpTasks(
      systemTask1,
      systemTask2,
      systemTask3,
      systemTask4,
      systemTask5
    ),
    callback
  ).then(() => bindValues(set));

}

function tearDownSystem() {
  return tearDownTasks();
}

export {
  setUpSystem,
  tearDownSystem
};
