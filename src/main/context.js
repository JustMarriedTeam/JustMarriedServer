import {createNamespace} from "continuation-local-storage";

const context = createNamespace("security");

function setInContext(name, value) {
  context.set(name, value);
}

function getFromContext(name) {
  return context.get(name);
}

const runInContext = (fn) => context.run(fn);

export {
  runInContext,
  setInContext,
  getFromContext
};
