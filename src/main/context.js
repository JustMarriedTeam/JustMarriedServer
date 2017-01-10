import {createNamespace} from "continuation-local-storage";
import get from "lodash/get";

const context = createNamespace("security");

function setInContext(name, value) {
  context.set(name, value);
}

function getFromContext(name) {
  return context.get(name);
}

function getFromRequestContext(path) {
  return get(getFromContext("request"), path);
}

function bindEmitter(emitter) {
  context.bindEmitter(emitter);
}

function bindToContext(fn) {
  return context.bind(fn);
}

const runInContext = (fn) => context.run(fn);

export {
  runInContext,
  setInContext,
  bindEmitter,
  bindToContext,
  getFromContext,
  getFromRequestContext
};
