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
 * @param _rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
function applyTo(values, _rules, keyStack) {
  if (!(0, types_1.isDate)(values.output)) {
    // could not convert to Date
    return ValueSchemaError_1.ValueSchemaError.raise(ValueSchemaError_1.RULE.TYPE, values, keyStack);
  }
  if (!(0, types_1.isValidDate)(values.output)) {
    // could convert to Date, but invalid.
    // mostly, the format is wrong.
    return ValueSchemaError_1.ValueSchemaError.raise(ValueSchemaError_1.RULE.PATTERN, values, keyStack);
  }
  // copy value
  values.output = new Date(values.output);
  return false;
}
exports.applyTo = applyTo;