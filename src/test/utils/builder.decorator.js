/* eslint-disable no-invalid-this */

import mongoose from "mongoose";
import cloneDeep from "lodash/cloneDeep";
import forEach from "lodash/forEach";
import keys from "lodash/keys";
import set from "lodash/set";
import has from "lodash/has";
import upperFirst from "lodash/upperFirst";

export default function (Model) {

  const schema = cloneDeep(Model.schema.obj);
  const Builder = function () {
    this.obj = {};
  };

  const setterNames = findFlatProperties(schema);

  forEach(keys(setterNames), (propertyPath) => {
    Builder.prototype[`with${upperFirst(propertyPath)}`] = (value) => {
      if (typeof value !== setterNames[propertyPath]) {
        throw new Error(`Tried to set property ${propertyPath} of type
          ${setterNames[propertyPath]} with value of incorrect type ${typeof value}`);
      }
      set(this.obj, propertyPath, value);
    };
  });

  Builder.prototype.build = () => new Model(this.obj);

  return Builder;

  function findFlatProperties(jsonobj, prefix) {
    let flatObj = {};

    function needToGoDeeper(o, f) {
      if (!(o[f] && typeof o[f] === "object")) {
        return false;
      } else if (!has(o[f], "type")) {
        return true;
      } else {
        const typeField = o[f].type;
        const isSchemaObject = typeField === mongoose.Schema.ObjectId;
        const isTypeName = typeField === String || typeField === Function;
        return !isSchemaObject && !isTypeName;
      }
    }

    function recurse(o, p) {
      for (const f in o) {
        const pre = p === undefined ? "" : `${p }.`;
        if (needToGoDeeper(o, f)) {
          flatObj = recurse(o[f], pre + f);
        } else {
          flatObj[pre + f] = typeof o[f];
        }
      }
      return flatObj;
    }

    return recurse(jsonobj, prefix);
  }

}
