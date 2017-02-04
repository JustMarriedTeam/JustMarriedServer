import Task, {TASK_STATUS} from "../../main/models/task.model";
import builderDecorator from "../utils/builder.decorator";

const TaskBuilder = builderDecorator(Task);

function aTask() {
  return new TaskBuilder();
}

const blackTask = aTask()
  .withName("black task")
  .withDescription("a black task")
  .withStatus(TASK_STATUS.BLOCKED)
  .build();

const blueTask = aTask()
  .withName("blue task")
  .withDescription("a blue task")
  .withStatus(TASK_STATUS.DONE)
  .build();

const greenTask = aTask()
  .withName("green task")
  .withDescription("a green task")
  .withStatus(TASK_STATUS.PENDING)
  .build();

const redTask = aTask()
  .withName("red task")
  .withDescription("a red task")
  .withStatus(TASK_STATUS.BLOCKED)
  .build();

export {
  aTask,
  redTask,
  greenTask,
  blueTask,
  blackTask
};
