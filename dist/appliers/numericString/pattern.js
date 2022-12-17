"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyTo = void 0;
var types_1 = require("../../libs/types");
var ValueSchemaError_1 = require("../../libs/ValueSchemaError");
var REGEXP = /^\d+$/;
/**
 * apply schema
 * @param values input/output values
 * @param _rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
function applyTo(values, _rules, keyStack) {
  // istanbul ignore next
  if (!(0, types_1.isString)(values.output)) {
    return false;
  }
  if (REGEXP.test(values.output)) {
    return false;
  }
  return ValueSchemaError_1.ValueSchemaError.raise(ValueSchemaError_1.RULE.PATTERN, values, keyStack);
}
exports.applyTo = applyTo;