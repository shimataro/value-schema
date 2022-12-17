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
  if (rules.minValue === undefined) {
    return false;
  }
  var minValue = normalizeRules(rules.minValue);
  if (!(0, types_1.isDate)(values.output)) {
    return false;
  }
  if (values.output.getTime() >= minValue.value.getTime()) {
    return false;
  }
  if (minValue.adjusts) {
    values.output = minValue.value;
    return false;
  }
  return ValueSchemaError_1.ValueSchemaError.raise(ValueSchemaError_1.RULE.MIN_VALUE, values, keyStack);
}
exports.applyTo = applyTo;
/**
 * normalize rules
 * @param minValueLike minimum value
 * @returns normalized rules
 */
function normalizeRules(minValueLike) {
  if ((0, types_1.isDate)(minValueLike)) {
    return {
      adjusts: false,
      value: minValueLike
    };
  }
  return minValueLike;
}