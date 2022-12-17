"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyTo = void 0;
var types_1 = require("../../libs/types");
var ValueSchemaError_1 = require("../../libs/ValueSchemaError");
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
function applyTo(values, rules, keyStack) {
  if ((0, types_1.isArray)(values.output)) {
    // already array
    return false;
  }
  if ((0, types_1.isString)(values.output) && rules.separatedBy !== undefined) {
    values.output = values.output.split(rules.separatedBy);
    return false;
  }
  if (rules.toArray !== undefined && rules.toArray) {
    values.output = [values.output];
    return false;
  }
  return ValueSchemaError_1.ValueSchemaError.raise(ValueSchemaError_1.RULE.TYPE, values, keyStack);
}
exports.applyTo = applyTo;