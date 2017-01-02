/* eslint-disable no-invalid-this */

import cloneDeep from "lodash/cloneDeep";
import forEach from "lodash/forEach";
import keys from "lodash/keys";
import set from "lodash/set";
import upperFirst from "lodash/upperFirst";

export default function (Model) {

  const schema = cloneDeep(Model.schema.obj);
  const Builder = function () {
    this.obj = {};
  };

  const setterNames = findFlatProperties(schema);

  forEach(setterNames, (propertyName) => {
    Builder.prototype[`with${upperFirst(propertyName)}`] = function (value) {
      set(this.obj, propertyName, value);
      return this;
    };
  });

  Builder.prototype.build = function () {
    return new Model(this.obj);
  };

  return Builder;

  function findFlatProperties(jsonobj) {
    return keys(jsonobj);
  }

}
