import Task from "../../main/models/task.model";
import builderDecorator from "../utils/builder.decorator";

const TaskBuilder = builderDecorator(Task);

function aTask() {
  return new TaskBuilder();
}

export {
  aTask
};
