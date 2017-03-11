import Task from "../../main/domain/models/task.model";
import builderDecorator from "../utils/builder.decorator";

const TaskBuilder = builderDecorator(Task);

function aTask(id) {
  return new TaskBuilder(id);
}

export {
  aTask
};
