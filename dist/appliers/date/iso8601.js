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
var PATTERN_WITH_TZ = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(.\d+)?)?(Z|[+-]\d{2}:\d{2})$/;
var PATTERN_WITHOUT_TZ = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(.\d+)?)?$/;
/**
 * apply schema
 * @param values input/output values
 * @param rules rules
 * @param keyStack key stack for error handling
 * @returns escapes from applyTo chain or not
 */
function applyTo(values, rules, keyStack) {
  var normalizedRules = __assign({
    iso8601: {
      defaultTimezone: ""
    }
  }, rules);
  if (!(0, types_1.isString)(values.output)) {
    return false;
  }
  var normalizedValue = normalize(values.output, normalizedRules.iso8601);
  if (normalizedValue === null) {
    // failed to normalize
    return ValueSchemaError_1.ValueSchemaError.raise(ValueSchemaError_1.RULE.PATTERN, values, keyStack);
  }
  values.output = new Date(normalizedValue);
  return false;
}
exports.applyTo = applyTo;
/**
 * normalize date format
 * @param value value to normalize
 * @param iso8601 rules
 * @returns normalized value
 */
function normalize(value, iso8601) {
  if (PATTERN_WITH_TZ.test(value)) {
    // valid format!
    return value;
  }
  var normalizedIso8601 = __assign({
    defaultTimezone: ""
  }, iso8601);
  if (normalizedIso8601.defaultTimezone === "") {
    // fails if default timezone is NOT specified
    return null;
  }
  if (!PATTERN_WITHOUT_TZ.test(value)) {
    // fails if not match with "no-timezone format"
    return null;
  }
  // append default timezone
  return "".concat(value).concat(normalizedIso8601.defaultTimezone);
}