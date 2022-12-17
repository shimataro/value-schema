"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyTo = void 0;
var types_1 = require("../../libs/types");
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param _keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
function applyTo(values, rules, _keyStack) {
  if (rules.separatedBy === undefined) {
    return false;
  }
  // istanbul ignore next
  if (!(0, types_1.isString)(values.output)) {
    return false;
  }
  values.output = values.output.split(rules.separatedBy).join("");
  return false;
}
exports.applyTo = applyTo;