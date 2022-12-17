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
  if (rules.maxValue === undefined) {
    return false;
  }
  var maxValue = normalizeRules(rules.maxValue);
  if (!(0, types_1.isDate)(values.output)) {
    return false;
  }
  if (values.output.getTime() <= maxValue.value.getTime()) {
    return false;
  }
  if (maxValue.adjusts) {
    values.output = maxValue.value;
    return false;
  }
  return ValueSchemaError_1.ValueSchemaError.raise(ValueSchemaError_1.RULE.MAX_VALUE, values, keyStack);
}
exports.applyTo = applyTo;
/**
 * normalize rules
 * @param maxValueLike maximum value
 * @returns normalized rules
 */
function normalizeRules(maxValueLike) {
  if ((0, types_1.isDate)(maxValueLike)) {
    return {
      adjusts: false,
      value: maxValueLike
    };
  }
  return maxValueLike;
}