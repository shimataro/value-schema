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
  var maxLength = normalizeRules(rules.maxLength);
  // istanbul ignore next
  if (!(0, types_1.isString)(values.output)) {
    return false;
  }
  if (values.output.length <= maxLength.length) {
    return false;
  }
  if (maxLength.trims !== undefined && maxLength.trims) {
    values.output = values.output.substr(0, maxLength.length);
    return false;
  }
  return ValueSchemaError_1.ValueSchemaError.raise(ValueSchemaError_1.RULE.MAX_LENGTH, values, keyStack);
}
exports.applyTo = applyTo;
/**
 * normalize rules
 * @param maxLength maximum length
 * @returns normalized rules
 */
function normalizeRules(maxLength) {
  var defaultRules = {
    length: Number.MAX_SAFE_INTEGER,
    trims: false
  };
  if (maxLength === undefined) {
    return defaultRules;
  }
  if ((0, types_1.isNumber)(maxLength)) {
    return __assign(__assign({}, defaultRules), {
      length: maxLength
    });
  }
  return __assign(__assign({}, defaultRules), maxLength);
}