"use strict";

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
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
  var maxValue = normalizeRules(rules.maxValue);
  // istanbul ignore next
  if (!(0, types_1.isNumber)(values.output)) {
    return false;
  }
  if (values.output <= maxValue.value) {
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
 * @param maxValue maximum value
 * @returns normalized rules
 */
function normalizeRules(maxValue) {
  var defaultRules = {
    value: Number.MAX_SAFE_INTEGER,
    adjusts: false
  };
  if (maxValue === undefined) {
    return defaultRules;
  }
  if ((0, types_1.isNumber)(maxValue)) {
    return __assign(__assign({}, defaultRules), {
      value: maxValue
    });
  }
  return __assign(__assign({}, defaultRules), maxValue);
}