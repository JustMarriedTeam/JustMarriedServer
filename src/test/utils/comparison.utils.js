import forOwn from "lodash/forOwn";
import unset from "lodash/unset";
import isObject from "lodash/isObject";

function omitByRecursivelyInPlace(value, iteratee) {
  return forOwn(value, (v, k) => {
    if (iteratee(v, k)) {
      unset(value, k);
    } else if (isObject(v)) {
      omitByRecursivelyInPlace(v, iteratee);
    }
  });
}

function withoutIdentifiers(payload) {
  return omitByRecursivelyInPlace(payload, (value, key) => {
    return key === "id";
  });
}

export {
  withoutIdentifiers
};
