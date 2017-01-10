import {createNamespace} from "continuation-local-storage";

const context = createNamespace("security");

function setInContext(name, value) {
  context.set(name, value);
}

function getFromContext(name) {
  return context.get(name);
}

function getFromRequestContext(name) {
  return context.get(`request.${name}`);
}

function bindEmitter(emitter) {
  context.bindEmitter(emitter);
}

const runInContext = (fn) => context.run(fn);

export {
  runInContext,
  setInContext,
  bindEmitter,
  getFromContext,
  getFromRequestContext
};
